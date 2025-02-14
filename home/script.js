// Initialize Supabase
const supabaseUrl = "https://your-project-id.supabase.co";  // Replace with your Supabase URL
const supabaseKey = "your-anon-key"; // Replace with your Supabase anon key
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Fetch categories from Supabase
async function fetchCategories() {
    let { data, error } = await supabase.from("categories").select("*");

    if (error) {
        console.error("Error fetching categories:", error);
        return;
    }

    displayCategories(data);
}

// Display categories in HTML
function displayCategories(categories) {
    const container = document.getElementById("category-container");
    container.innerHTML = ""; // Clear previous content

    categories.forEach(category => {
        let div = document.createElement("div");
        div.classList.add("category-item");
        div.textContent = category.name;
        div.setAttribute("data-category-id", category.id);
        div.onclick = () => console.log(`Selected Category ID: ${category.id}`);
        container.appendChild(div);
    });
}

// Load categories on page load
fetchCategories();
