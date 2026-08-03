const fs = require('fs');
const file = 'src/components/shop/view-cart/ShoppingCart.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<div className="notification-progress">[\s\S]*?<\/div>\s*<\/div>/,
  `<div className="notification-progress p-3 mb-3" style={{ border: "1px solid #3ec1bc", borderRadius: "8px", backgroundColor: "#f8fffe" }}>
                        <p className="text-center mb-2" style={{ fontSize: "13px", color: "#3ec1bc", fontWeight: "600" }}>{freeshipMessage}</p>
                        <div className="progress-cart" style={{ height: "6px", backgroundColor: "#e9ecef", borderRadius: "3px", overflow: "hidden" }}>
                          <div
                            className="value"
                            style={{ width: \`\${shipProgressPercent}%\`, backgroundColor: "#3ec1bc", height: "100%", transition: "width 0.3s ease" }}
                            data-progress={Math.round(shipProgressPercent)}
                          />
                        </div>
                      </div>`
);

content = content.replace(
  /<h5 className="title mb-20">Order Summary<\/h5>/,
  `<h5 className="title mb-20 pb-3" style={{ borderBottom: "1px solid #e9ecef", color: "#212529", fontWeight: "600", fontSize: "18px" }}>Order Summary</h5>`
);

content = content.replace(
  /className="action-checkout tf-btn w-100 animate-btn text-center"/,
  `className="action-checkout w-100 text-center mt-3" style={{ backgroundColor: "#3ec1bc", color: "white", padding: "14px", borderRadius: "6px", border: "none", fontWeight: "600", fontSize: "15px", textTransform: "uppercase", letterSpacing: "0.5px" }}`
);

fs.writeFileSync(file, content);
console.log("Updated ShoppingCart.tsx");
