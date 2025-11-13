/**
 * Merges two className strings, with custom classes taking precedence
 * for conflicting properties
 */
export const mergeClassNames = (
  baseClassName: string,
  customClassName?: string
): string => {
  if (!customClassName) {
    return baseClassName;
  }

  // Split classNames into arrays
  const baseClasses = baseClassName.split(/\s+/).filter(Boolean);
  const customClasses = customClassName.split(/\s+/).filter(Boolean);

  // Create a Set with custom classes (they take precedence)
  const customSet = new Set(customClasses);

  // Filter out base classes that are overridden by custom classes
  // This is a simple approach - classes with same prefix are considered conflicting
  const merged = baseClasses.filter((baseClass) => {
    // Get the utility prefix (e.g., "bg-" from "bg-blue-500")
    const basePrefix = baseClass.match(/^[a-z-]+/)?.[0] || baseClass;
    const hasConflict = Array.from(customSet).some((customClass) => {
      const customPrefix = customClass.match(/^[a-z-]+/)?.[0] || customClass;
      return basePrefix === customPrefix;
    });
    return !hasConflict;
  });

  // Combine and return
  return [...merged, ...Array.from(customSet)].join(" ");
};
