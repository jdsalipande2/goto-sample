// Initialize Supabase
const supabaseUrl = "https://etmxbelqfwpbrvtucxhr.supabase.co";  // Replace with your Supabase URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0bXhiZWxxZndwYnJ2dHVjeGhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzMTk1NDIsImV4cCI6MjA1NDg5NTU0Mn0.XWOH2RMftx_JO-UCABTSnI4kv_-h8-Y-J8z6v_FJ5ro"; // Replace with your Supabase anon key
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
