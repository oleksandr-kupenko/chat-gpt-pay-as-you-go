export const convertToHtml = (text: string) => {
  const paragraphs = text.split('\n').map((line) => `<p>${line}</p>`);
  return paragraphs.join('');
};

export const createId = () => {
  return Math.random().toString(36).substring(2) + new Date().getTime().toString(36);
};
