import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('.env', 'utf-8');
const extract = (key) => {
  const match = envText.match(new RegExp(`${key}="(.*?)"`));
  return match ? match[1] : null;
};

const SUPABASE_URL = extract('VITE_SUPABASE_URL');
const SUPABASE_SERVICE_KEY = extract('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const body = `When you're looking to create custom apparel for your brand, team, or event, you'll inevitably run into two major printing methods: Screen Printing and Direct-to-Film (DTF) printing. Both have their place in the custom apparel industry, but choosing the right one can save you money and give you a better final product.

![Screen Printing vs DTF Printing](/images/blog/screen_vs_dtf.png)

## What is Screen Printing?

Screen printing is the traditional method of t-shirt printing. It involves creating a woven mesh stencil (a screen) for each color in your design and pushing ink through the screen onto the fabric. 

### Pros of Screen Printing:
- **Cost-Effective for Bulk:** Once the screens are made, printing hundreds of shirts is very fast and cheap.
- **Classic Feel:** The ink soaks into the fabric, giving a traditional, soft feel (especially with water-based inks).

### Cons of Screen Printing:
- **High Setup Costs:** You pay for every color in your design because each color requires a separate screen.
- **High Minimum Orders:** Because of the setup time, most print shops require a minimum order of 24 to 50 shirts.
- **Limited Colors:** Printing full-color photographs or intricate gradients is incredibly difficult and expensive.

## What is DTF (Direct-to-Film) Printing?

Direct-to-Film printing is a modern technique where your design is printed onto a special film using water-based inks, coated with an adhesive powder, and then heat-pressed onto the garment.

### Pros of DTF Printing:
- **Unlimited Colors:** Whether your logo has two colors or a full-color photograph with gradients, the cost is the same.
- **No Setup Fees or Minimums:** Because there are no screens to burn, you can order just one custom shirt without paying massive setup fees.
- **Versatility:** DTF prints can be applied to almost any fabric—cotton, polyester, blends, and even nylon or leather.
- **Durability:** The prints are incredibly durable, stretchy, and crack-resistant.

### Cons of DTF Printing:
- **Feel:** The print sits on top of the fabric. While high-quality DTF feels thin and flexible, it is slightly thicker than a traditional water-based screen print.
- **Cost at Extremely High Volume:** For an order of 1,000+ shirts with a simple 1-color logo, screen printing will ultimately be cheaper per unit.

## Which Should You Choose?

At Fast Apparel, we specialize in **DTF Printing** because it perfectly aligns with what most modern brands and local businesses need: high-quality, full-color prints with fast turnarounds and low minimums. 

If you are starting a clothing line, outfitting a small staff, or need vibrant full-color graphics without breaking the bank on setup fees, DTF is the clear winner. 

Ready to see the DTF difference for yourself? [**Get a Free Quote Today!**](/quote)`;

async function run() {
  const { data, error } = await supabase.from('blog_posts').insert({
    slug: "screen-printing-vs-dtf-printing-comparison",
    title: "Screen Printing vs. DTF Printing: Which is Better for Custom Apparel?",
    description: "Confused about custom t-shirt printing methods? Discover the pros and cons of Screen Printing versus Direct-to-Film (DTF) printing to make the best choice.",
    category: "Printing Guide",
    city: "Atlanta",
    read_minutes: 5,
    author: "Fast Apparel Printing Experts",
    cover_gradient: "from-blue-brand to-cyan-brand",
    cover_emoji: "👕",
    keywords: ["screen printing vs dtf", "dtf printing benefits", "custom apparel printing methods", "best t-shirt printing", "dtf vs screen print", "atlanta custom shirts"],
    body: body,
    status: "published",
    cover_image_url: "/images/blog/screen_vs_dtf.png",
    cover_image_credit: "Fast Apparel AI Generated"
  });

  if (error) {
    console.error("Error inserting blog post:", error);
  } else {
    console.log("Blog post inserted successfully!");
  }
}

run();
