import React, { useState } from 'react';

const defectObjects = [
  {
    id: 'OBJ123',
    image: '/images/obj1.jpg',
    dimensions: '20x10x15 cm',
    defect: true,
    description: 'Scratch on surface'
  },
  {
    id: 'OBJ456',
    image: '/images/obj2.jpg',
    dimensions: '10x8x12 cm',
    defect: true,
    description: 'Cracked casing'
  }
];

function ObjectDefects() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Defect Objects</h2>
      {defectObjects.map(obj => (
        <div key={obj.id} className="mb-4 border-b pb-2">
          <p><strong>ID:</strong> {obj.id}</p>
          <p><strong>Dimensions:</strong> {obj.dimensions}</p>
          <p><strong>Defect:</strong> {obj.defect ? 'Yes' : 'No'}</p>
          <p><strong>Description:</strong> {obj.description}</p>
          <img
            src={obj.image}
            alt="Object"
            className="w-32 cursor-pointer mt-2"
            onClick={() => setSelectedImage(obj.image)}
          />
        </div>
      ))}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Enlarged" className="max-w-xl rounded-xl" />
        </div>
      )}
    </div>
  );
}

export default ObjectDefects;