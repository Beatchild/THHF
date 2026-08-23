const fs = require('fs');
let code = fs.readFileSync('src/app/(public)/[slug]/page.tsx', 'utf8');

// Change the main container from max-w-6xl to max-w-[90rem]
code = code.replace(
  '<div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-12 pb-24">',
  '<div className="max-w-[85rem] mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-12 lg:gap-24 pb-24">'
);

// Remove the max-w-3xl from the main text content, so it spans as wide as the layout allows
code = code.replace(
  '<div className="flex-1 w-full max-w-3xl">',
  '<div className="flex-1 w-full">'
);

// Make the Sidebar only hidden on smaller than lg to match the new lg:flex-row
code = code.replace(
  '<div className="hidden md:block w-72 shrink-0">',
  '<div className="hidden lg:block w-72 shrink-0">'
);

// If there is any upNext section, also widen its container
code = code.replace(
  '<div className="max-w-6xl mx-auto px-4 py-24">',
  '<div className="max-w-[85rem] mx-auto px-6 md:px-12 py-24">'
);

fs.writeFileSync('src/app/(public)/[slug]/page.tsx', code);
