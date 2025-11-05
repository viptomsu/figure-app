import React from "react";

const Map: React.FC = () => {
  return (
    <div id="map-area" className="w-full h-[450px]">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d238138.35868060403!2d105.21464224844357!3d21.155905882270336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31348a99d97bb735%3A0xbbe74b2d5282f818!2sDistrict%20de%20Ba%20Vi%2C%20Hano%C3%AF%2C%20Vietnam!5e0!3m2!1sfr!2s!4v1748621383341!5m2!1sfr!2s"
        className="w-full h-full border-0"
        loading="lazy"
        title="This is a unique title"
      ></iframe>
    </div>
  );
};

export default Map;
