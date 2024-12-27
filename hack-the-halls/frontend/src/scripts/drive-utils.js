export const getFileId = (url) => {
  const patterns = [/\/file\/d\/([^/]+)/, /id=([^&]+)/, /\/d\/([^/]+)/];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
};

export const getDownloadLink = (fileId) => {
  return `https://drive.usercontent.google.com/download?id=${fileId}&export=download`;
};

export const getDriveLinks = () => {
  const elements = document.getElementsByClassName(
    "qhnNic LBlAUc Aopndd TIunU"
  );
  const anchorTags = [];

  Array.from(elements).forEach((element) => {
    const anchors = element.getElementsByTagName("a");
    Array.from(anchors).forEach((anchor) => {
      if (anchor.href.includes("drive.google.com")) {
        anchorTags.push({
          href: anchor.href,
          text: anchor.textContent.trim(),
        });
      }
    });
  });

  return anchorTags;
};
