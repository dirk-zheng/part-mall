export function slugify(value = '') {
  return value
    .toLowerCase()
    .replace(/["“”']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function productSlug(product) {
  return slugify(product?.name || product?.id || 'wheel-program');
}

export const servicePages = {
  'quality-control': {
    title: 'Wheel Pre-shipment Inspection in Guangzhou',
    eyebrow: 'On-site quality control',
    intro: 'We visit the finished-goods warehouse and draw cartons at random before shipment, checking the confirmed order requirements instead of relying on presentation samples.',
    image: '/quality-center.png',
    sections: [
      ['What we inspect', 'The inspection scope is agreed around the order. Typical checks include finish and porosity, spoke roots, dimensions, runout, dynamic balance, coating adhesion, markings, accessories and export packaging.'],
      ['Random-carton sampling', 'Cartons are selected from finished stock by our team. Findings are recorded against the order checklist, with affected items isolated and reinspection arranged where necessary.'],
      ['Clear limits and records', 'Pre-shipment sampling supports order control but does not replace manufacturer responsibility, laboratory testing or destination-market compliance. Available records and test reports are confirmed for the specific product.'],
    ],
  },
  'mixed-container-orders': {
    title: 'Mixed Container Wheel Orders from China',
    eyebrow: 'Practical trial orders',
    intro: 'Build a commercially useful mix of wheel styles and fitments before committing to repeat full-container volumes.',
    image: '/wheels/urbansport-set.png',
    sections: [
      ['Plan around your market', 'We begin with destination market, popular vehicles, target price position and preferred finishes. That brief is converted into a focused mix rather than a generic catalog selection.'],
      ['Confirm the loading plan', 'Available styles, item-level MOQ, carton dimensions, production schedule and container utilization are reviewed before quotation. Mixed loading remains subject to the confirmed production plan.'],
      ['Scale proven fitments', 'A trial shipment can help identify reliable sellers. Repeat demand can then be consolidated into simpler, more stable full-container programs.'],
    ],
  },
  'export-documents': {
    title: 'Wheel Test Reports and Export Document Support',
    eyebrow: 'Order documentation',
    intro: 'We coordinate commercial and supporting documents around the confirmed product, destination market and order terms.',
    image: '/wheels/wheel-qc-lab.png',
    sections: [
      ['Standard export documents', 'Commercial invoices, packing lists and standard export paperwork are prepared around the final shipment details and agreed loading plan.'],
      ['Product-specific reports', 'Material, fatigue and impact reports may be available or arranged depending on the product and market requirement. The report owner, standard, model coverage and validity must be checked before order confirmation.'],
      ['Confirm requirements early', 'Tell us the destination country, customs requirement and customer standard during quotation. This avoids discovering an unavailable document after production has started.'],
    ],
  },
};

export const articlePages = {
  'wheel-fitment-pcd-offset-center-bore': {
    title: 'Wheel Fitment Basics: PCD, Offset and Center Bore',
    description: 'A practical wheel fitment guide for importers covering PCD, offset, center bore, load rating and brake clearance before bulk ordering.',
    date: '2026-08-12',
    readTime: '8 min read',
    image: '/wheels/wheel-qc-lab.png',
    intro: 'PCD, offset and center bore are essential, but a safe fitment decision also needs wheel size, load requirement and brake clearance.',
    sections: [
      ['PCD identifies the bolt pattern', 'PCD combines the number of mounting holes with the diameter of the circle through their centers. A matching number of holes is not enough: the circle diameter must also match exactly.'],
      ['Offset controls wheel position', 'Offset is the distance between the mounting face and the wheel centerline. Changing it moves the wheel inward or outward, affecting suspension clearance, fender clearance and steering geometry.'],
      ['Center bore supports correct mounting', 'The center bore must clear the vehicle hub. Where an appropriate hub ring is used, its dimensions and material should be confirmed as part of the complete fitment rather than treated as an afterthought.'],
      ['Verify the complete application', 'Before a bulk order, record make, model, year, sales market, trim and brake or suspension changes. Then confirm diameter, width, PCD, offset, center bore, load rating, tire size and brake clearance together.'],
    ],
  },
  'mixed-container-wheel-order-guide': {
    title: 'How to Plan a Mixed-container Wheel Trial Order',
    description: 'Plan a mixed-container alloy wheel order by balancing vehicle coverage, sizes, finishes, MOQ and loading efficiency.',
    date: '2026-08-05',
    readTime: '6 min read',
    image: '/wheels/urbansport-set.png',
    intro: 'A useful trial order is not simply a large number of styles. It should test a small number of clear market assumptions without creating slow-moving fragments.',
    sections: [
      ['Start with vehicle demand', 'List the locally popular vehicles and the customer segments you already serve. Group applications that can share practical wheel specifications and confirm all fitment details before ordering.'],
      ['Limit unnecessary variation', 'Every extra finish, size and cap design can create another MOQ and production variable. Prioritize combinations with a clear sales reason and use common finishes where possible.'],
      ['Check carton and container utilization', 'Item quantities must work with carton dimensions, production MOQ and container capacity. A visually balanced product mix can still be inefficient to load, so confirm the loading calculation before approval.'],
      ['Define the learning goal', 'Decide what the trial should prove: a new vehicle application, finish, price band or dealer segment. Repeat the proven combinations and remove weak ones from the next shipment.'],
    ],
  },
  'wheel-pre-shipment-inspection-checklist': {
    title: 'Wheel Pre-shipment Inspection Checklist for Importers',
    description: 'Learn what a practical alloy wheel pre-shipment inspection covers, from random cartons and spoke roots to runout, coating and packing.',
    date: '2026-07-21',
    readTime: '9 min read',
    image: '/quality-center.png',
    intro: 'A useful inspection links every checkpoint to the approved specification, sample, packaging requirement and agreed sampling scope.',
    sections: [
      ['Select cartons from finished stock', 'Sampling should represent the shipment. Random carton selection reduces the risk of reviewing only factory-prepared display pieces. Record carton and product markings so findings remain traceable.'],
      ['Inspect finish and critical areas', 'Review coating consistency, color, contamination, porosity and damage. Give particular attention to spoke roots, mounting surfaces, bolt holes, center bore and other areas specified in the inspection checklist.'],
      ['Measure agreed technical items', 'Depending on the order, checks may cover dimensions, runout, dynamic balance, weight, coating adhesion and markings. Use calibrated equipment where the result depends on measurement accuracy.'],
      ['Close findings before release', 'Record defects with clear photographs and quantities, isolate affected goods, agree corrective action and reinspect when required. Sampling does not replace laboratory certification or the manufacturer’s product responsibility.'],
    ],
  },
};

export const articleCards = {
  2: 'wheel-fitment-pcd-offset-center-bore',
  3: 'mixed-container-wheel-order-guide',
  5: 'wheel-pre-shipment-inspection-checklist',
};
