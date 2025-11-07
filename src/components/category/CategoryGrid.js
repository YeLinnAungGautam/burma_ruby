import CategorySlider from "./CategorySlider";

// Server-side caching with Next.js
export const revalidate = 600; // 10 minutes

async function getCategories() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/categories`, {
      next: {
        revalidate: 600,
        tags: ["categories"],
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function CategoryGrid() {
  const categories = await getCategories();

  if (!categories.length) {
    return (
      <div className="text-center py-2">
        <p className="text-gray-500">No categories available</p>
      </div>
    );
  }

  return <CategorySlider categories={categories} />;
}
