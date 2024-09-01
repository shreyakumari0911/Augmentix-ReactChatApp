export const isImage = (url) => {
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url); // RegEx to check for image extensions
  };
  
  // Helper function to determine if the file is a video
export const isVideo = (url) => {
    return /\.(mp4|webm|ogg|mov|avi|mkv|flv)$/i.test(url); // RegEx to check for video extensions
};

export const getGoogleDriveImageUrl = (fileId) => {
  // return `https://drive.google.com/uc?export=view&id=${fileId}`;
  // return `https://drive.usercontent.google.com/download?id=${fileId}&export=view`
  return `https://drive.google.com/uc?export=download&id=${fileId}`
};