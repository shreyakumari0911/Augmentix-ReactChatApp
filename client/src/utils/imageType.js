export const isImage = (url) => {
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url); // RegEx to check for image extensions
  };
  
  // Helper function to determine if the file is a video
export const isVideo = (url) => {
    return /\.(mp4|webm|ogg|mov|avi|mkv|flv)$/i.test(url); // RegEx to check for video extensions
};