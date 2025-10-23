// Function to fetch categories and update industry links
async function updateIndustryLinks() {
    try {
        // Fetch categories from the API endpoint
        const response = await fetch('https://api.sandbox.pepagora.org/get-category-home');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data || !data.data) {
            console.warn('No category data received from API');
            return;
        }
        
        // Create a mapping function to get liveUrl by category name
        const getLiveUrlByName = (categoryName) => {
            const category = data.data.find(cat => 
                cat.name.toLowerCase().includes(categoryName.toLowerCase())
            );
            return category ? category.liveUrl : '';
        };
        
        // Map category names to their corresponding liveUrl for footer
        const footerCategoryUrls = {
            'Apparel & Fashion': getLiveUrlByName('Apparel & Fashion'),
            'Industrial Equipment & Machinery': getLiveUrlByName('Industrial Equipment & Machinery'),
            'Home & Lifestyle': getLiveUrlByName('Home & Lifestyle'),
            'Health & Personal Care': getLiveUrlByName('Health & Personal Care'),
            'Food & Agriculture': getLiveUrlByName('Food & Agriculture'),
            'Construction': getLiveUrlByName('Construction'),
            'Electronics & Electrical': getLiveUrlByName('Electronics & Electrical'),
            'Automotive & Transport': getLiveUrlByName('Automotive & Transport'),
            'Raw Materials & Chemicals': getLiveUrlByName('Raw Materials & Chemicals'),
            'Sports & Entertainment': getLiveUrlByName('Sports & Entertainment'),
            'Tools & Hardware': getLiveUrlByName('Tools & Hardware'),
            'Packaging & Printing': getLiveUrlByName('Packaging & Printing'),
            'Office Supplies & Equipment': getLiveUrlByName('Office Supplies & Equipment'),
            'Services & Support': getLiveUrlByName('Services & Support')
        };
        
        // Update the industry links with dynamic URLs
        const industryLinks = document.querySelectorAll('#industries-links a[data-category]');
        
        industryLinks.forEach(link => {
            const categoryName = link.getAttribute('data-category');
            const liveUrl = footerCategoryUrls[categoryName];
            
            if (liveUrl) {
                link.href = `/c/${liveUrl}`;
            } else {
                // Fallback to original href if no liveUrl found
                console.warn(`No liveUrl found for category: ${categoryName}`);
            }
        });
        
    } catch (error) {
        console.error('Error fetching categories:', error);
        // Keep the original placeholder links if API fails
    }
}

// Function to initialize footer dynamic links after footer is loaded
function initializeFooterDynamicLinks() {
    // Check if footer is loaded and has the industries links
    const industriesLinks = document.querySelector('#industries-links');
    if (industriesLinks) {
        updateIndustryLinks();
    } else {
        // If footer not loaded yet, wait a bit and try again
        setTimeout(initializeFooterDynamicLinks, 100);
    }
}
