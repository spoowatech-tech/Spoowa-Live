const products = [
  { id: 1, name: 'CITRUS BURST', tag: 'Super Electrolytes', rating: 4.8, reviews: 120, price: 149 },
  { id: 2, name: 'BERRY BLITZ', tag: 'Extra Electrolytes', rating: 4.8, reviews: 98, price: 149 },
  { id: 3, name: 'TROPICAL TIDE', tag: 'Super Electrolytes', rating: 4.9, reviews: 110, price: 149 },
  { id: 4, name: 'MELON MIST', tag: 'Super Electrolytes', rating: 4.7, reviews: 89, price: 149 },
];

export function getProducts(req, res) {
  res.json({ products });
}
