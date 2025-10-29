import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import multer from "multer";
import cloudinary from "./config/cloudinary";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// Image upload endpoint
app.post("/upload", upload.single("image"), async (req: Request, res: Response) => {
  try {
    console.log("Upload endpoint hit");
    console.log("File received:", req.file ? "Yes" : "No");
    
    if (!req.file) {
      console.log("No file provided");
      return res.status(400).json({ error: "No image file provided" });
    }

    console.log("File details:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Check Cloudinary config
    console.log("Cloudinary config:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? "Set" : "Not set",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "Set" : "Not set"
    });

    // Upload to Cloudinary
    console.log("Starting Cloudinary upload...");
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "movies", // Optional: organize images in a folder
          // Use 'limit' to avoid filling/cropping which can sometimes produce unexpected backgrounds.
          // Also let Cloudinary auto-select best format and quality.
          transformation: [
            { width: 400, height: 600, crop: "limit" },
            { quality: "auto" }
          ],
          fetch_format: "auto",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            console.log("Cloudinary upload success:", result?.public_id);
            resolve(result);
          }
        }
      );

      uploadStream.end(req.file!.buffer);
    });

    console.log("Upload completed successfully");
    res.json({ imageUrl: (result as any).secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ 
      error: "Failed to upload image", 
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Create
app.post("/movies", async (req: Request, res: Response) => {
  try {
    const movie = await prisma.movie.create({ data: req.body });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: "Failed to create movie" });
  }
});

// Read (with pagination)
app.get("/movies", async (req: Request, res: Response) => {
  try {
    const skip = Number(req.query.skip) || 0;
    const take = Number(req.query.take) || 10;
    const movies = await prisma.movie.findMany({
      skip,
      take,
      orderBy: { id: "desc" },
    });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

// Update
app.put("/movies/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updated = await prisma.movie.update({
      where: { id },
      data: req.body,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update movie" });
  }
});

// Delete
app.delete("/movies/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.movie.delete({ where: { id } });
    res.json({ message: "Movie deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete movie" });
  }
});

// Database info endpoint
app.get("/db-info", async (req: Request, res: Response) => {
  try {
    const totalMovies = await prisma.movie.count();
    const recentMovies = await prisma.movie.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });
    
    res.json({
      totalMovies,
      recentMovies,
      message: "Database connection successful"
    });
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Backend running on port ${PORT}`)
);