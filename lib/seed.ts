import { ID } from "react-native-appwrite";
import { appwriteConfig, databases, storage } from "./appwrite";
import dummyData from "./data";

interface Category {
  name: string;
  description: string;
}

interface Customization {
  name: string;
  price: number;
  type: "topping" | "side" | "size" | "crust" | string; // extend as needed
}

interface MenuItem {
  name: string;
  description: string;
  image_url: string;
  price: number;
  rating: number;
  calories: number;
  protein: number;
  category_name: string;
  customizations: string[]; // list of customization names
}

interface DummyData {
  categories: Category[];
  customizations: Customization[];
  menu: MenuItem[];
}

// ensure dummyData has correct shape
const data = dummyData as DummyData;

async function clearAll(collectionId: string): Promise<void> {
  try {
    const list = await databases.listDocuments(
      appwriteConfig.databaseId!,
      collectionId
    );

    if (list.documents.length > 0) {
      await Promise.all(
        list.documents.map((doc) =>
          databases.deleteDocument(appwriteConfig.databaseId!, collectionId, doc.$id)
        )
      );
    }
  } catch (error) {
    console.log(`⚠️ Could not clear collection ${collectionId}:`, error);
  }
}

async function clearStorage(): Promise<void> {
  try {
    const list = await storage.listFiles(appwriteConfig.bucketId!);

    if (list.files.length > 0) {
      await Promise.all(
        list.files.map((file) =>
          storage.deleteFile(appwriteConfig.bucketId!, file.$id)
        )
      );
    }
  } catch (error) {
    console.log(`⚠️ Could not clear storage:`, error);
  }
}

async function uploadImageToStorage(imageUrl: string) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const blob = await response.blob();

    const fileObj = {
      name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`,
      type: blob.type,
      size: blob.size,
      uri: imageUrl,
    };

    const file = await storage.createFile(
      appwriteConfig.bucketId!,
      ID.unique(),
      fileObj
    );

    return storage.getFileViewURL(appwriteConfig.bucketId!, file.$id);
  } catch (error) {
    return imageUrl;
  }
}

async function seed(): Promise<void> {
  try {
    if (!appwriteConfig.databaseId || !appwriteConfig.categoriesCollectionId || 
        !appwriteConfig.customizationCollectionId || !appwriteConfig.menusCollectionId || 
        !appwriteConfig.menuCustomizationCollectionId || !appwriteConfig.bucketId) {
      throw new Error("Missing required Appwrite configuration");
    }

    await clearAll(appwriteConfig.categoriesCollectionId!);
    await clearAll(appwriteConfig.customizationCollectionId!);
    await clearAll(appwriteConfig.menusCollectionId!);
    await clearAll(appwriteConfig.menuCustomizationCollectionId!);
    await clearStorage();

    const categoryMap: Record<string, string> = {};
    for (const cat of data.categories) {
      const doc = await databases.createDocument(
        appwriteConfig.databaseId!,
        appwriteConfig.categoriesCollectionId!,
        ID.unique(),
        cat
      );
      categoryMap[cat.name] = doc.$id;
    }

    const customizationMap: Record<string, string> = {};
    for (const cus of data.customizations) {
      const doc = await databases.createDocument(
        appwriteConfig.databaseId!,
        appwriteConfig.customizationCollectionId!,
        ID.unique(),
        {
          name: cus.name,
          price: cus.price,
          type: cus.type,
        }
      );
      customizationMap[cus.name] = doc.$id;
    }

    for (const item of data.menu) {
      const uploadedImage = await uploadImageToStorage(item.image_url);

      const doc = await databases.createDocument(
        appwriteConfig.databaseId!,
        appwriteConfig.menusCollectionId!,
        ID.unique(),
        {
          name: item.name,
          description: item.description,
          image_url: uploadedImage,
          price: item.price,
          rating: item.rating,
          calories: item.calories,
          protein: item.protein,
          categories: categoryMap[item.category_name],
        }
      );

      for (const cusName of item.customizations) {
        if (customizationMap[cusName]) {
          await databases.createDocument(
            appwriteConfig.databaseId!,
            appwriteConfig.menuCustomizationCollectionId!,
            ID.unique(),
            {
              menu: doc.$id,
              customizations: customizationMap[cusName],
            }
          );
        }
      }
    }

    console.log("✅ Seeding complete.");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

export default seed;
