import React from 'react';
import {GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '400px',
  height: '400px'
};

function MapContainer({ lat, lng }) { // 接收lat和lng作为props
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCnTSXvmcY82JojmHZnk_sxDS_lJgO-sMo", // 替换为您的Google Maps API密钥
    libraries: ["marker"]
  });

  const mapOptions = {
    disableDefaultUI: true, // 禁用所有默认的UI组件
    zoomControl: false, // 禁用缩放控件
    streetViewControl: false, // 禁用街道视图
    mapTypeControl: false, // 禁用地图类型控件
    draggable: false, // 禁止拖动地图
    scrollwheel: false, // 禁止滚轮缩放
    disableDoubleClickZoom: true, // 禁止双击缩放
    clickableIcons: false // 禁止点击地图上的图标
  };

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat, lng }} // 使用传入的lat和lng动态设置地图中心
        zoom={19.5} // 可以调整zoom值以更好地显示位置
        options={mapOptions}
      >
        <Marker
          position={{ lat, lng }}
        />
      </GoogleMap>
  ) : <></>;
}

export default React.memo(MapContainer);