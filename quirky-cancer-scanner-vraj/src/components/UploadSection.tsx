import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, Image, AlertCircle, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";

const UploadSection = ({ onUploadComplete }: { onUploadComplete: (result: any) => void }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError(t("errors.fileType"));
      toast({
        variant: "destructive",
        title: t("errors.invalidFileType"),
        description: t("errors.pleaseUploadImage"),
      });
      return;
    }
    
    setError(null);
    
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setProgress(0);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: t("errors.authRequired"),
          description: t("errors.pleaseSignIn"),
        });
        setUploading(false);
        return;
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${uuidv4()}`;
      
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 5;
        setProgress(Math.min(currentProgress, 95));
        
        if (currentProgress >= 95) {
          clearInterval(interval);
        }
      }, 150);
      
      const uploadToCloudinary = async () => {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
          reader.onload = async (e) => {
            const base64Image = e.target?.result;
            
            try {
              const { data, error } = await supabase.functions.invoke('upload-to-cloudinary', {
                body: {
                  image: base64Image,
                  fileName: fileName
                }
              });
              
              if (error) throw error;
              
              resolve(data);
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        });
      };
      
      const cloudinaryResponse: any = await uploadToCloudinary();
      
      if (!cloudinaryResponse.success) {
        throw new Error(cloudinaryResponse.error || "Failed to upload to Cloudinary");
      }
      
      const imageUrl = cloudinaryResponse.url;
      
      const result = await simulateAnalysis(file.name, imageUrl, user.id);
      
      setProgress(100);
      
      setTimeout(() => {
        setUploading(false);
        onUploadComplete(result);
        toast({
          title: t("scans.analysisComplete"),
          description: t("scans.scanSuccessfullyAnalyzed"),
        });
      }, 1000);
      
    } catch (error: any) {
      console.error("Upload error:", error);
      setError(error.message || t("errors.uploadFailed"));
      toast({
        variant: "destructive",
        title: t("errors.uploadFailed"),
        description: error.message || t("errors.errorDuringUpload"),
      });
      setUploading(false);
    }
  };

  const simulateAnalysis = async (imageName: string, imageUrl: string, userId: string) => {
    const result = {
      timestamp: new Date().toISOString(),
      imageName: imageName,
      detectionResult: Math.random() > 0.7 ? "abnormal" : "normal",
      confidence: (Math.random() * 20 + 80).toFixed(2) + "%",
      biomarkers: {
        p53: Math.random().toFixed(2),
        ki67: Math.random().toFixed(2),
        her2: Math.random().toFixed(2),
      },
      recommendations: [
        t("scans.recommendations.reviewWithDoctor"),
        t("scans.recommendations.followUpScan"),
        t("scans.recommendations.maintainScreening")
      ],
      imageUrl: imageUrl
    };
    
    const { data, error } = await supabase
      .from('scan_results')
      .insert({
        user_id: userId,
        image_name: imageName,
        detection_result: result.detectionResult,
        confidence: result.confidence,
        biomarkers: result.biomarkers,
        recommendations: result.recommendations,
        image_url: imageUrl
      })
      .select();
    
    if (error) {
      console.error("Error saving scan results:", error);
      throw new Error("Failed to save scan results to database");
    }
    
    return result;
  };

  const resetUpload = () => {
    setFile(null);
    setPreview(null);
    setProgress(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        <span className="text-gradient bg-gradient-to-r from-cancer-blue to-cancer-purple bg-clip-text text-transparent">
          {t("scans.uploadAndDiagnose")}
        </span>
      </h2>
      
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-cancer-blue bg-cancer-blue/5"
              : "border-gray-300 hover:border-cancer-blue/50 hover:bg-gray-50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            className="hidden"
            accept="image/*"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <div className="mb-4 w-20 h-20 rounded-full bg-cancer-blue/10 flex items-center justify-center">
              <Upload className="w-10 h-10 text-cancer-blue" />
            </div>
            
            <h3 className="text-xl font-bold mb-2">{t("scans.dragDropHere")}</h3>
            <p className="text-gray-500 mb-4">{t("scans.or")} {t("scans.clickToBrowse")}</p>
            
            <p className="text-sm text-gray-400">
              {t("scans.supportedFormats")} (max 10MB)
            </p>
          </motion.div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="relative">
            {preview && (
              <div className="relative aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={preview}
                  alt={t("scans.imagePreview")}
                  className="object-contain max-h-full max-w-full"
                />
              </div>
            )}
            
            <button
              onClick={resetUpload}
              className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                  <Image size={20} className="text-gray-500" />
                </div>
                <div>
                  <p className="font-medium text-sm truncate max-w-[200px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              {error ? (
                <div className="flex items-center text-red-500 text-sm">
                  <AlertCircle size={16} className="mr-1" />
                  {error}
                </div>
              ) : null}
            </div>
            
            {uploading ? (
              <div className="space-y-3">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-center text-gray-500">
                  {progress < 100 
                    ? t("scans.analyzing") 
                    : t("scans.processingResults")}
                </p>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={resetUpload}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  className="flex-1 bg-cancer-blue hover:bg-cancer-blue/90"
                  onClick={handleUpload}
                >
                  {t("scans.analyze")}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadSection;
