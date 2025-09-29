import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "@firebase/firestore";
import { uploadImageToCloudinary } from "./imageService";

export const updateUserProfile = async (
  userId: string,
  userData: UserDataType
): Promise<ResponseType> => {
  try {
    if (userData.image.uri) {
      const imageUploadRes = await uploadImageToCloudinary(userData.image, "users");
      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Error occurred while uploading image",
        };
      }
      userData.image = imageUploadRes.data;
    }
    const userRef = doc(firestore, "users", userId);
    await updateDoc(userRef, userData);
    return {
      success: true,
      msg: "User data updated successfully",
    };
  } catch (error: any) {
    console.log("error", error);
    return {
      success: false,
      msg: error.message,
    };
  }
};
