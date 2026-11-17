# NEXORA visual target — TWOTWO adaptation
Source: https://styles.refero.design/style/170a690b-7424-4c2e-9d08-975725cf9261
Public style page and source screenshot reviewed. Refero MCP returned NO_SUBSCRIPTION; public page supplied the design specification.

Lock: white canvas, black hairline structure, #e6e6e6 secondary surfaces, #e3fc03 only for action fills/selected states/hero headline, regular grotesque typography, 16px static surfaces and 50px interactive controls. No decorative gradients or shadows. Product photographs carry color.

Decisions:
- Storefront: dominant full-width product photo with centered lime display headline, 3-column editorial product grid, full-width pill add-to-cart actions, black footer. Source: TWOTWO hero and card rules.
- CRM: retain sidebar and business dashboard layout from the existing application; apply black/white structure and regular typography, monochrome charts, lime for selected navigation/actions. Source: user scope + TWOTWO token role discipline.
- Font: Inter 400 as the source's documented substitute for Whyte; system Arial fallback. No proprietary font files copied.
- Mobile: 1-column product grid; 40px+ controls; readable typography and no clipped tables (horizontal scrolling retained).
- Product assets: existing legitimate Unsplash photography; grayscale only the hero for readable lime copy, preserve color in catalogue imagery.

QA target: source screenshot and this lock. Browser preview previously failed due to infrastructure; retry supported preview once and report if still unavailable. Typecheck/build required. Inventory behavior unchanged.

## Motion and media update
Hero: 12s silent product-photo film, desaturated behind the existing lime heading. Separate 30s captioned product/CRM overview with native controls and a direct MP4 download. No borrowed TWOTWO video or fabricated customer endorsements.
Community: three stock-photo editorial cards, explicitly labelled as demo photography.
Motion: 650ms staggered IntersectionObserver reveal, 600ms photo hover, 300ms workspace entry, pausable ticker and background film. Progressive enhancement leaves content visible without observer support. Reduced-motion disables automatic motion; play() rejection is handled with the poster retained.
