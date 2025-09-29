import { firestore } from "@/config/firebase";
import { ResponseType, WalletType } from "@/types";
import { collection, deleteDoc, doc, setDoc } from "@firebase/firestore";
import { uploadImageToCloudinary } from "./imageService";

export const createOrUpdateWallet = async (
  walletData: Partial<WalletType>
): Promise<ResponseType> => {
  try {
    let walletToSave = { ...walletData };
    if (walletData.image) {
      const imageUploadRes = await uploadImageToCloudinary(
        walletData.image,
        "wallets"
      );
      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Error occurred while uploading image",
        };
      }
      walletToSave.image = imageUploadRes.data;
    }
    if (!walletData.id) {
      // new wallet
      walletToSave.amount = 0;
      walletToSave.created = new Date();
      walletToSave.totalIncome = 0;
      walletToSave.totalExpenses = 0;
    }

    const walletRef = walletData.id
      ? doc(firestore, "wallets", walletData.id)
      : doc(collection(firestore, "wallets"));

    // update wallet
    await setDoc(walletRef, walletToSave, { merge: true });
    return {
      success: true,
      data: { ...walletToSave, id: walletRef.id },
    };
  } catch (error: any) {
    console.log("error creating or update wallet:", error);
    return { success: false, msg: error.message };
  }
};

export const deleteWallet = async (walletId: string): Promise<ResponseType> => {
  try {
    const walletRef = doc(firestore, "wallets", walletId);
    await deleteDoc(walletRef);

    return { success: true, msg: "Wallet deleted successfully" };
  } catch (error: any) {
    console.log("error deleting wallet:", error);
    return { success: false, msg: error.message };
  }
};
