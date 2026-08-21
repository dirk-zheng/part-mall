//执行slugify函数逻辑
export function slugify(value = '') {
  return value
    .toLowerCase()
    .replace(/["“”']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

//执行productSlug函数逻辑
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
