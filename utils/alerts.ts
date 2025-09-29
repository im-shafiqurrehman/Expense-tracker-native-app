import { Alert } from 'react-native';

// Alert titles
export const ALERT_TITLES = {
  SUCCESS: 'Success',
  ERROR: 'Error',
  WARNING: 'Warning',
  CONFIRMATION: 'Confirmation',
  VALIDATION: 'Validation',
  TRANSACTION: 'Transaction',
  WALLET: 'Wallet',
  PROFILE: 'Profile',
  AUTH: 'Authentication',
  DELETE: 'Delete',
  LOGOUT: 'Logout',
} as const;

// Alert messages
export const ALERT_MESSAGES = {
  // Validation messages
  FILL_REQUIRED_FIELDS: 'Please fill all required fields',
  ENTER_NAME: 'Please enter your name',
  SELECT_WALLET_ICON: 'Please select your wallet icon',
  SELECT_IMAGE: 'Please select an image',
  
  // Success messages
  TRANSACTION_SAVED: 'Transaction saved successfully',
  TRANSACTION_UPDATED: 'Transaction updated successfully',
  TRANSACTION_DELETED: 'Transaction deleted successfully',
  WALLET_SAVED: 'Wallet saved successfully',
  WALLET_UPDATED: 'Wallet updated successfully',
  WALLET_DELETED: 'Wallet deleted successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  
  // Confirmation messages
  DELETE_TRANSACTION_CONFIRM: 'Are you sure you want to delete this transaction?',
  DELETE_WALLET_CONFIRM: 'Are you sure you want to delete this wallet?\n\nThis action will remove all transactions associated with this wallet.',
  LOGOUT_CONFIRM: 'Are you sure you want to logout?',
  
  // Error messages
  GENERAL_ERROR: 'An error occurred. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UPLOAD_ERROR: 'Failed to upload image. Please try again.',
  AUTH_ERROR: 'Authentication failed. Please try again.',
} as const;

// Alert button texts
export const ALERT_BUTTONS = {
  OK: 'OK',
  CANCEL: 'Cancel',
  DELETE: 'Delete',
  CONFIRM: 'Confirm',
  RETRY: 'Retry',
  LOGOUT: 'Logout',
} as const;

// Utility functions for consistent alerts
export const showAlert = {
  // Success alerts
  success: (title: string, message: string, onPress?: () => void) => {
    Alert.alert(title, message, [{ text: ALERT_BUTTONS.OK, onPress }]);
  },

  // Error alerts
  error: (title: string, message: string, onPress?: () => void) => {
    Alert.alert(title, message, [{ text: ALERT_BUTTONS.OK, onPress }]);
  },

  // Validation alerts
  validation: (message: string, onPress?: () => void) => {
    Alert.alert(ALERT_TITLES.VALIDATION, message, [{ text: ALERT_BUTTONS.OK, onPress }]);
  },

  // Confirmation alerts
  confirmation: (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    Alert.alert(title, message, [
      {
        text: ALERT_BUTTONS.CANCEL,
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: ALERT_BUTTONS.CONFIRM,
        onPress: onConfirm,
      },
    ]);
  },

  // Delete confirmation alerts
  deleteConfirmation: (
    itemType: string,
    message: string,
    onDelete: () => void,
    onCancel?: () => void
  ) => {
    Alert.alert(
      `Delete ${itemType}`,
      message,
      [
        {
          text: ALERT_BUTTONS.CANCEL,
          style: 'cancel',
          onPress: onCancel,
        },
        {
          text: ALERT_BUTTONS.DELETE,
          style: 'destructive',
          onPress: onDelete,
        },
      ]
    );
  },

  // Custom alerts
  custom: (
    title: string,
    message: string,
    buttons: Array<{
      text: string;
      style?: 'default' | 'cancel' | 'destructive';
      onPress?: () => void;
    }>
  ) => {
    Alert.alert(title, message, buttons);
  },
};

// Specific alert functions for common use cases
export const showTransactionAlert = {
  validation: (onPress?: () => void) => {
    showAlert.validation(ALERT_MESSAGES.FILL_REQUIRED_FIELDS, onPress);
  },
  
  success: (isUpdate: boolean = false, onPress?: () => void) => {
    const message = isUpdate ? ALERT_MESSAGES.TRANSACTION_UPDATED : ALERT_MESSAGES.TRANSACTION_SAVED;
    showAlert.success(ALERT_TITLES.TRANSACTION, message, onPress);
  },
  
  deleteConfirmation: (onDelete: () => void, onCancel?: () => void) => {
    showAlert.deleteConfirmation(
      'Transaction',
      ALERT_MESSAGES.DELETE_TRANSACTION_CONFIRM,
      onDelete,
      onCancel
    );
  },
};

export const showWalletAlert = {
  validation: {
    name: (onPress?: () => void) => {
      showAlert.validation(ALERT_MESSAGES.ENTER_NAME, onPress);
    },
    icon: (onPress?: () => void) => {
      showAlert.validation(ALERT_MESSAGES.SELECT_WALLET_ICON, onPress);
    },
  },
  
  success: (isUpdate: boolean = false, onPress?: () => void) => {
    const message = isUpdate ? ALERT_MESSAGES.WALLET_UPDATED : ALERT_MESSAGES.WALLET_SAVED;
    showAlert.success(ALERT_TITLES.WALLET, message, onPress);
  },
  
  deleteConfirmation: (onDelete: () => void, onCancel?: () => void) => {
    showAlert.deleteConfirmation(
      'Wallet',
      ALERT_MESSAGES.DELETE_WALLET_CONFIRM,
      onDelete,
      onCancel
    );
  },
};

export const showProfileAlert = {
  validation: (onPress?: () => void) => {
    showAlert.validation(ALERT_MESSAGES.ENTER_NAME, onPress);
  },
  
  success: (onPress?: () => void) => {
    showAlert.success(ALERT_TITLES.PROFILE, ALERT_MESSAGES.PROFILE_UPDATED, onPress);
  },
};

export const showAuthAlert = {
  logoutConfirmation: (onLogout: () => void, onCancel?: () => void) => {
    showAlert.custom(
      ALERT_TITLES.LOGOUT,
      ALERT_MESSAGES.LOGOUT_CONFIRM,
      [
        {
          text: ALERT_BUTTONS.CANCEL,
          style: 'cancel',
          onPress: onCancel,
        },
        {
          text: ALERT_BUTTONS.LOGOUT,
          style: 'destructive',
          onPress: onLogout,
        },
      ]
    );
  },
};
