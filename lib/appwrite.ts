import { CreateUserParams, GetMenuParams, SignInParams } from "@/type";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID,
  categoriesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID,
  menusCollectionId: process.env.EXPO_PUBLIC_APPWRITE_MENUS_COLLECTION_ID,
  customizationCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_CUSTOMIZATION_COLLECTION_ID,
  menuCustomizationCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_MENUCUSTOMIZATION_COLLECTION_ID,
  bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKED_ID,
  platform: "com.jsm.foodordering",
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint!)
  .setProject(appwriteConfig.projectId!)
  .setPlatform(appwriteConfig.platform!);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);

export const createUser = async ({
  email,
  password,
  name,
}: CreateUserParams) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) throw Error;

    await signIn({ email, password });

    const avatarUrl = avatars.getInitialsURL(name);

    return await databases.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.userCollectionId!,
      ID.unique(),
      {
        email,
        name,
        accountId: newAccount.$id,
        avatar: avatarUrl,
      }
    );
  } catch (error: any) {
    throw new Error(error.message || error.toString());
  }
};

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error: any) {
    throw new Error(error.message || error.toString());
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.userCollectionId!,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    throw new Error(error as string);
  }
};

export const getMenu = async ({ category, query }: GetMenuParams) => {
  try {
    const queries: string[] = [];
    if (category) queries.push(Query.equal("categories", category));
    if (query) queries.push(Query.search("name", query));

    const menus = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.menusCollectionId!,
      queries
    );
    return menus.documents;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getCategories = async () => {
  try {
    const categories = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.categoriesCollectionId!
    );
    return categories.documents;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getMenuItemDetails = async (menuId: string) => {
  try {
    const menu = await databases.getDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.menusCollectionId!,
      menuId
    );
    return menu;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getCustomizationDetails = async () => {
  try {
    const customizations = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.customizationCollectionId!
    );

    const sides = customizations.documents.filter(
      (item) => item.type === "side"
    );
    const toppings = customizations.documents.filter(
      (item) => item.type === "topping"
    );

    // console.log('Sides:', JSON.stringify(sides, null, 2));
    // console.log('Toppings:', JSON.stringify(toppings, null, 2));

    return { sides, toppings };
  } catch (error) {
    throw new Error(error as string);
  }
};

export const updateUserLocation = async (userId: string, homeAddress: string, workAddress: string, currentLocation: string) => {
  try {
    // Alternar entre las direcciones reales
    const newHomeAddress = currentLocation === homeAddress ? workAddress : homeAddress;
    const newWorkAddress = currentLocation === homeAddress ? homeAddress : workAddress;
    
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.userCollectionId!,
      userId,
      {
        home: newHomeAddress,
        work: newWorkAddress
      }
    );
    return updatedUser;
  } catch (error) {
    throw new Error(error as string);
  }
};
