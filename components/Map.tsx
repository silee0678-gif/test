import React, { useEffect, useRef } from 'react';
import type { Crosswalk } from '../types';

declare global {
  interface Window {
    kakao: any;
  }
}

interface MapProps {
  crosswalks: Crosswalk[];
  selectedCrosswalkId: number;
  onSelectCrosswalk: (id: number) => void;
}

const Map: React.FC<MapProps> = ({ crosswalks, selectedCrosswalkId, onSelectCrosswalk }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markers = useRef<any[]>([]);

  useEffect(() => {
    if (!mapContainer.current || !window.kakao) {
      return;
    }

    window.kakao.maps.load(() => {
      if (!mapContainer.current) return; // Component might have unmounted

      const options = {
        center: new window.kakao.maps.LatLng(35.8558, 128.5878), // Centered on DNUE
        level: 4,
      };
      mapInstance.current = new window.kakao.maps.Map(mapContainer.current, options);

      // Create marker images
      const normalMarkerImageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
      const selectedMarkerImageSrc = 'http://t1.daumcdn.net/mapjsapi/images/marker.png';
      const imageSize = new window.kakao.maps.Size(24, 35);
      const selectedImageSize = new window.kakao.maps.Size(29, 42); // Make selected marker slightly larger

      const normalMarkerImage = new window.kakao.maps.MarkerImage(normalMarkerImageSrc, imageSize);
      const selectedMarkerImage = new window.kakao.maps.MarkerImage(selectedMarkerImageSrc, selectedImageSize, {offset: new window.kakao.maps.Point(14, 42)});

      markers.current = crosswalks.map(cw => {
        const position = new window.kakao.maps.LatLng(cw.lat, cw.lng);
        const marker = new window.kakao.maps.Marker({
          position,
          image: cw.id === selectedCrosswalkId ? selectedMarkerImage : normalMarkerImage,
          title: cw.name,
        });

        window.kakao.maps.event.addListener(marker, 'click', () => {
          onSelectCrosswalk(cw.id);
        });
        
        marker.setMap(mapInstance.current);
        return { id: cw.id, marker, normalImage: normalMarkerImage, selectedImage: selectedMarkerImage };
      });

    });
  }, []);

  useEffect(() => {
    // Don't run this effect until the map instance is created
    if (!mapInstance.current) return;

    // Update marker styles based on selection without recreating them
    markers.current.forEach(({ id, marker, normalImage, selectedImage }) => {
      if (id === selectedCrosswalkId) {
        marker.setImage(selectedImage);
        marker.setZIndex(100); // Bring selected marker to front
        mapInstance.current.panTo(marker.getPosition());
      } else {
        marker.setImage(normalImage);
        marker.setZIndex(0);
      }
    });
  }, [selectedCrosswalkId]);

  return (
    <div 
        id="map" 
        ref={mapContainer} 
        className="w-full h-64 rounded-lg shadow-lg border-2 border-gray-700 mb-8"
        aria-label="Interactive map of crosswalk locations"
    ></div>
    );
};

export default Map;