import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const movieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.string().min(1, "Type is required"),
  director: z.string().min(1, "Director is required"),
  budget: z.string().min(1, "Budget is required"),
  location: z.string().min(1, "Location is required"),
  duration: z.string().min(1, "Duration is required"),
  yearTime: z.string().min(1, "Year/Time is required"),
  imageUrl: z.string().optional(),
});

type MovieFormData = z.infer<typeof movieSchema>;

type Movie = {
  id: number;
  title: string;
  type: string;
  director: string;
  budget: string;
  location: string;
  duration: string;
  yearTime: string;
  imageUrl?: string;
};

interface MovieFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  movie?: Movie | null; // For editing existing movie
  mode?: 'add' | 'edit';
}

export default function MovieForm({ onSuccess, onCancel, movie, mode = 'add' }: MovieFormProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(movie?.imageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const { 
    register, 
    handleSubmit, 
    reset, 
    watch,
    formState: { errors, isSubmitting } 
  } = useForm<MovieFormData>({
    resolver: zodResolver(movieSchema),
    defaultValues: movie ? {
      title: movie.title,
      type: movie.type,
      director: movie.director,
      budget: movie.budget,
      location: movie.location,
      duration: movie.duration,
      yearTime: movie.yearTime
    } : {
      title: '',
      type: '',
      director: '',
      budget: '',
      location: '',
      duration: '',
      yearTime: ''
    }
  });

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedImage) return null;

    setIsUploading(true);
    try {
      console.log("Starting image upload...");
      console.log("Selected file:", {
        name: selectedImage.name,
        size: selectedImage.size,
        type: selectedImage.type
      });

      const formData = new FormData();
      formData.append('image', selectedImage);

      console.log("Making request to upload endpoint...");
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Upload response:", response.data);
      return response.data.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      
      // More detailed error reporting
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
        console.error('Response headers:', error.response?.headers);
        
        const errorMessage = error.response?.data?.error || error.response?.data?.details || error.message;
        alert(`Failed to upload image: ${errorMessage}`);
      } else {
        alert('Failed to upload image. Please try again.');
      }
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    const hasFormData = Object.values(watch()).some(value => value && value.toString().trim() !== '');
    
    if (hasFormData && mode === 'add') {
      if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        onCancel?.();
      }
    } else if (mode === 'edit') {
      if (confirm('Are you sure you want to cancel editing? Any changes will be lost.')) {
        onCancel?.();
      }
    } else {
      onCancel?.();
    }
  };

  const onSubmit = async (data: MovieFormData) => {
    try {
      // Upload image if selected
      let imageUrl = movie?.imageUrl || null;
      if (selectedImage) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          // If image upload failed, don't proceed
          return;
        }
      }

      // Include image URL in the data
      const movieData = { ...data, imageUrl };

      if (mode === 'edit' && movie?.id) {
        // Update existing movie
        await axios.put(`http://localhost:5000/movies/${movie.id}`, movieData);
      } else {
        // Create new movie
        await axios.post("http://localhost:5000/movies", movieData);
      }
      reset();
      onSuccess?.();
    } catch (error) {
      console.error(`Error ${mode === 'edit' ? 'updating' : 'adding'} movie:`, error);
      alert(`Failed to ${mode === 'edit' ? 'update' : 'add'} movie. Please try again.`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Image Upload Section */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Movie Poster</label>
        
        {/* Image Preview */}
        {imagePreview && (
          <div className="flex justify-center">
            <img
              src={imagePreview}
              alt="Movie poster preview"
              className="w-32 h-48 object-cover rounded-lg shadow-md"
              style={{ backgroundColor: 'transparent', mixBlendMode: 'normal', filter: 'none' }}
            />
          </div>
        )}
        
        {/* File Input */}
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleImageSelect}
            />
          </label>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2">
        <div>
          <input 
            {...register("title")} 
            placeholder="Title" 
            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>
        
        <div>
          <input 
            {...register("type")} 
            placeholder="Type (e.g., Movie, TV Show)" 
            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          />
          {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
        </div>
        
        <div>
          <input 
            {...register("director")} 
            placeholder="Director" 
            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          />
          {errors.director && <p className="text-red-500 text-sm mt-1">{errors.director.message}</p>}
        </div>
        
        <div>
          <input 
            {...register("budget")} 
            placeholder="Budget" 
            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          />
          {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>}
        </div>
        
        <div>
          <input 
            {...register("location")} 
            placeholder="Location" 
            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
        </div>
        
        <div>
          <input 
            {...register("duration")} 
            placeholder="Duration" 
            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          />
          {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>}
        </div>
      </div>
      
      <div>
        <input 
          {...register("yearTime")} 
          placeholder="Year/Time" 
          className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
        />
        {errors.yearTime && <p className="text-red-500 text-sm mt-1">{errors.yearTime.message}</p>}
      </div>

      <div className="flex gap-3 pt-4">
        <button 
          type="submit" 
          disabled={isSubmitting || isUploading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-md transition-colors"
        >
          {isUploading 
            ? "Uploading image..." 
            : isSubmitting 
              ? (mode === 'edit' ? "Updating..." : "Adding...") 
              : (mode === 'edit' ? "Update Movie" : "Add Movie")
          }
        </button>
        {onCancel && (
          <button 
            type="button" 
            onClick={handleCancel}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-md transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}