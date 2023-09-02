import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { ImageType } from "../../types/upload/upload";
import sharp from "sharp";


// Upload Image
export const uploadImage = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { w, h, type = ImageType.PNG, quality = 90 as any } = req.query;
    const { buffer } = req?.file as Express.Multer.File;

    // check if the type is valid
    if (!Object.values(ImageType).includes(type as any)) {
      return next(new Error("Invalid image type"));
    }

    const baseImage = w && h ? sharp(buffer).resize(+w, +h) : sharp(buffer);
    const filename = `${Date.now()}-${Math.random()}-quality-${quality}`;

    switch (type) {
      case "jpeg":
        await baseImage
          .toFormat(`jpeg`)
          .jpeg({ quality: +quality })
          .toFile(`./uploads/${filename}.jpeg`);
        break;
      case "jpg":
        await baseImage
          .toFormat(`jpg`)
          .jpeg({ quality: +quality })
          .toFile(`./uploads/${filename}.jpg`);
        break;
      case "gif":
        await baseImage
            .toFormat(`gif`)
            .toFile(`./uploads/${filename}.gif`);
        break;
      case "webp":
        await baseImage
          .toFormat(`webp`)
          .webp({ quality: +quality })
          .toFile(`./uploads/${filename}.webp`);
        break;
      case "svg":
        await baseImage
            .toFormat(`svg`)
            .toFile(`./uploads/${filename}.svg`);
        break;
      default:
        await baseImage
          .toFormat(`png`)
          .png({ quality: +quality })
          .toFile(`./uploads/${filename}.png`);
    }

    const imageUrl = `${process.env.APP_URL}/uploads/${filename}.${type}`;
    const image = `${filename}.${type}`;
    res.status(200).json({ imageUrl, image });
  }
);


// Upload File
export const uploadFile = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        res.status(200).json({fileUrl: req.body.fileUrl, file: req.body.file});
    }
);