import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  User, 
  Mail, 
  Camera, 
  Save, 
  Loader2,
  Building,
  Briefcase,
  MapPin,
  Phone,
  FileText,
  Globe,
  Edit3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { updateProfileSchema } from "@shared/schema";
import type { UpdateProfile, User as UserType } from "@shared/schema";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Create form validation schema that matches UpdateProfile requirements
const profileFormSchema = z.object({
  name: z.string().default(""),
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  bio: z.string().default(""),
  company: z.string().default(""),
  jobRole: z.string().default(""),
  industry: z.string().default(""),
  experience: z.string().default(""),
  country: z.string().default(""),
  state: z.string().default(""),
  city: z.string().default(""),
  zipCode: z.string().default(""),
  phone: z.string().default(""),
  interests: z.array(z.string()).default([]),
  profilePicture: z.string().default(""),
  dtExperienceLevel: z.string().default(""),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading, refreshUser, logout } = useAuth();
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [deleteConfirmation, setDeleteConfirmation] = useState<string>("");
  const [deletePassword, setDeletePassword] = useState<string>("");

  const { data: deleteAccountInfo } = useQuery<{ requiresPassword: boolean }>({
    queryKey: ["/api/users/delete-account-info"],
    enabled: !!user,
  });
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, authLoading, navigate]);
  
  // Fetch user profile data
  const { data: profile, isLoading } = useQuery<UserType>({
    queryKey: ["/api/users/profile"],
    enabled: !!user,
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      company: "",
      jobRole: "",
      industry: "",
      experience: "",
      country: "",
      state: "",
      city: "",
      zipCode: "",
      phone: "",
      interests: [],
      profilePicture: "",
      dtExperienceLevel: "",
    },
  });

  // Reset form when profile data loads
  useEffect(() => {
    if (profile) {
      // Backend returns snake_case (profile_picture) but form uses camelCase
      const profilePic = (profile as any).profile_picture || profile.profilePicture || "";
      
      form.reset({
        name: profile.name || "",
        email: profile.email || "",
        bio: profile.bio || "",
        company: profile.company || "",
        jobRole: profile.jobRole || "",
        industry: profile.industry || "",
        experience: profile.experience || "",
        country: profile.country || "",
        state: profile.state || "",
        city: profile.city || "",
        zipCode: profile.zipCode || "",
        phone: profile.phone || "",
        interests: (profile.interests as string[]) || [],
        profilePicture: profilePic,
        dtExperienceLevel: profile.dtExperienceLevel || (profile as any).dt_experience_level || "",
      });
      setProfilePicture(profilePic);
    }
  }, [profile, form]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfile) => {
      const response = await apiRequest("PUT", "/api/users/profile", data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao atualizar perfil");
      }
      return response.json();
    },
    onSuccess: async (updatedProfile) => {
      // Update local state with the returned profile picture
      // Handle both snake_case (backend) and camelCase (Drizzle) formats
      if (updatedProfile) {
        const pic = updatedProfile.profilePicture || (updatedProfile as any).profile_picture;
        if (pic) {
          setProfilePicture(pic);
        }
      }
      
      // Invalidate both profile and user queries to update avatar everywhere
      queryClient.invalidateQueries({ queryKey: ["/api/users/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      // Refresh auth context to update avatar in header/menu
      await refreshUser();
      
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
    },
    onError: (error: Error) => {
      let errorMessage = error.message;
      
      // Handle specific error cases
      if (error.message.includes('413') || error.message.includes('too large')) {
        errorMessage = "Foto muito grande. Tente uma imagem menor ou use o botão para compressar automaticamente.";
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
      }
      
      toast({
        title: "Erro ao atualizar perfil",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const compressImage = (file: File, maxWidth: number = 256): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions - max 256x256
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        const newWidth = Math.max(Math.floor(img.width * ratio), 100); // Min 100px
        const newHeight = Math.max(Math.floor(img.height * ratio), 100); // Min 100px
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // Draw the image
        ctx?.drawImage(img, 0, 0, newWidth, newHeight);
        
        // Try WebP first for better compression
        let compressedBase64 = '';
        let format = 'image/webp';
        let quality = 0.8;
        
        // Check WebP support
        try {
          compressedBase64 = canvas.toDataURL('image/webp', quality);
          if (compressedBase64.indexOf('data:image/webp') !== 0) {
            throw new Error('WebP not supported');
          }
        } catch {
          // Fallback to JPEG
          format = 'image/jpeg';
          compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        }
        
        let sizeInMB = (compressedBase64.length * 0.75) / (1024 * 1024); // Base64 to bytes conversion
        
        // Progressive compression - target 100KB max (more aggressive)
        while (sizeInMB > 0.1 && quality > 0.2) { // Keep under 100KB, min 20% quality
          quality -= 0.1;
          compressedBase64 = canvas.toDataURL(format, quality);
          sizeInMB = (compressedBase64.length * 0.75) / (1024 * 1024);
        }
        
        // If still too large, reduce dimensions gradually
        if (sizeInMB > 0.1) {
          let currentWidth = newWidth;
          let currentHeight = newHeight;
          
          while (sizeInMB > 0.1 && currentWidth > 100) {
            currentWidth = Math.floor(currentWidth * 0.9);
            currentHeight = Math.floor(currentHeight * 0.9);
            
            canvas.width = currentWidth;
            canvas.height = currentHeight;
            ctx?.clearRect(0, 0, currentWidth, currentHeight);
            ctx?.drawImage(img, 0, 0, currentWidth, currentHeight);
            
            compressedBase64 = canvas.toDataURL(format, 0.6);
            sizeInMB = (compressedBase64.length * 0.75) / (1024 * 1024);
          }
        }
        
        console.log(`Compressed image from ${(file.size / (1024 * 1024)).toFixed(1)}MB to ${sizeInMB.toFixed(2)}MB (${Math.round(quality * 100)}% quality, ${canvas.width}x${canvas.height}px, ${format})`);
        resolve(compressedBase64);
      };
      
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if it's an image
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Arquivo inválido",
          description: "Por favor, selecione uma imagem (JPG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }

      // Increased limit to 5MB (more conservative for base64)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: `A imagem deve ter no máximo 5MB. Sua foto tem ${(file.size / (1024 * 1024)).toFixed(1)}MB`,
          variant: "destructive",
        });
        return;
      }

      try {
        // Show loading
        toast({
          title: "Processando imagem...",
          description: "Comprimindo e otimizando sua foto",
        });

        // Compress the image
        const compressedImage = await compressImage(file);
        setProfilePicture(compressedImage);
        form.setValue("profilePicture", compressedImage);

        toast({
          title: "Foto carregada!",
          description: "Sua foto foi otimizada e está pronta para salvar",
        });
      } catch (error) {
        toast({
          title: "Erro ao processar imagem",
          description: "Não foi possível processar sua foto. Tente outra imagem.",
          variant: "destructive",
        });
      }
    }
  };

  const onSubmit = (data: ProfileFormData) => {
    // Drizzle expects camelCase, so we keep the form data as-is
    // Just ensure we have the latest profile picture from state
    const submitData = {
      ...data,
      profilePicture: profilePicture || data.profilePicture,
    };
    
    updateProfileMutation.mutate(submitData);
  };

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/users/delete-account", {
        password: deleteAccountInfo?.requiresPassword ? deletePassword : undefined,
      });
      return response.json();
    },
    onSuccess: async () => {
      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída com sucesso.",
      });

      queryClient.clear();
      await logout();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao excluir conta",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-6 py-8 pb-32">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Meu Perfil
            </h1>
            <p className="text-gray-600">
              Gerencie suas informações pessoais e preferências
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Profile Picture Section */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-blue-600" />
                    Foto do Perfil
                  </CardTitle>
                  <CardDescription>
                    Escolha uma foto para personalizar seu perfil
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="w-24 h-24">
                        {profilePicture ? (
                          <AvatarImage src={profilePicture} alt="Profile" />
                        ) : (
                          <AvatarFallback className="bg-blue-600 text-white text-xl">
                            {profile?.name ? getUserInitials(profile.name) : "U"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <Button
                        type="button"
                        size="sm"
                        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                        onClick={() => fileInputRef.current?.click()}
                        data-testid="button-upload-photo"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        data-testid="button-change-photo"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Alterar Foto
                      </Button>
                      <p className="text-sm text-gray-500 mt-2">
                        JPG, PNG ou GIF. Máximo 10MB.
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      data-testid="input-file-photo"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Informações Pessoais
                  </CardTitle>
                  <CardDescription>
                    Informações básicas sobre você
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Nome Completo
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome completo" {...field} data-testid="input-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="seu@email.com" 
                            {...field} 
                            data-testid="input-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Telefone
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="(11) 99999-9999" {...field} data-testid="input-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Bio
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Conte um pouco sobre você..."
                              className="resize-none"
                              rows={3}
                              {...field}
                              data-testid="textarea-bio"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    Informações Profissionais
                  </CardTitle>
                  <CardDescription>
                    Detalhes sobre sua carreira e experiência
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="jobRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          Cargo
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Designer, Desenvolvedor, etc." {...field} data-testid="input-job-role" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          Empresa
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da empresa" {...field} data-testid="input-company" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Setor
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Tecnologia, Design, etc." {...field} data-testid="input-industry" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experiência</FormLabel>
                        <FormControl>
                          <Input placeholder="Júnior, Pleno, Sênior, etc." {...field} data-testid="input-experience" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Design Thinking Experience Level */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Nível de experiência em Design Thinking
                  </CardTitle>
                  <CardDescription>
                    Nos ajude a adaptar a linguagem, exemplos e passos do DTTOOLS para o seu nível atual.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="dtExperienceLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nível atual</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <SelectTrigger data-testid="select-dt-experience-level">
                              <SelectValue placeholder="Selecione seu nível" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">
                                Estou começando em Design Thinking
                              </SelectItem>
                              <SelectItem value="advanced">
                                Já trabalho com Design Thinking no dia a dia
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Location Information */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Localização
                  </CardTitle>
                  <CardDescription>
                    Onde você está localizado
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>País</FormLabel>
                        <FormControl>
                          <Input placeholder="Brasil" {...field} data-testid="input-country" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Input placeholder="São Paulo" {...field} data-testid="input-state" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input placeholder="São Paulo" {...field} data-testid="input-city" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <Input placeholder="00000-000" {...field} data-testid="input-zip-code" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 pb-8">
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={updateProfileMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 shadow-lg"
                  data-testid="button-save-profile"
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </div>

              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    Zona de Perigo
                  </CardTitle>
                  <CardDescription>
                    Excluir sua conta é uma ação permanente.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Ao excluir sua conta, seus projetos e dados associados serão removidos.
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        variant="destructive"
                        disabled={deleteAccountMutation.isPending}
                        data-testid="button-delete-account"
                      >
                        Excluir minha conta
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão da conta</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Para confirmar, digite <strong>DELETE</strong>.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <div className="space-y-3">
                        <Input
                          value={deleteConfirmation}
                          onChange={(e) => setDeleteConfirmation(e.target.value)}
                          placeholder="Digite DELETE"
                          data-testid="input-delete-confirmation"
                        />

                        {deleteAccountInfo?.requiresPassword ? (
                          <Input
                            type="password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            placeholder="Digite sua senha"
                            data-testid="input-delete-password"
                          />
                        ) : null}
                      </div>

                      <AlertDialogFooter>
                        <AlertDialogCancel
                          type="button"
                          onClick={() => {
                            setDeleteConfirmation("");
                            setDeletePassword("");
                          }}
                        >
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                          type="button"
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => deleteAccountMutation.mutate()}
                          disabled={
                            deleteAccountMutation.isPending ||
                            deleteConfirmation.trim().toUpperCase() !== "DELETE" ||
                            (deleteAccountInfo?.requiresPassword && deletePassword.length === 0)
                          }
                        >
                          {deleteAccountMutation.isPending ? "Excluindo..." : "Excluir definitivamente"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}