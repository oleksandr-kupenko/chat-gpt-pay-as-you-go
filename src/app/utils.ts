export const convertToHtml = (text: string) => {
  const paragraphs = text.split('\n').map((line) => `<p>${line}</p>`);
  return paragraphs.join('');
};
