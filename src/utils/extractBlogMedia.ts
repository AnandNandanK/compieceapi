export const extractBlogMedia = (content: string): Set<string> => {
  const mediaRegex = /uploads\/blogs\/(images|videos)\/[^\s"'<>]+/g;
  const matches = content.match(mediaRegex) || [];
  return new Set(matches);
};
