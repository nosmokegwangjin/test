const axios = require('axios');
const { kakao } = require('kakao-maps-js');
const Supercluster = require('supercluster');

async function fetchData() {
  try {
    // GitHub Actions에서 설정한 시크릿을 가져옴
    const kakaoMapApiKey = process.env.KAKAO_MAP_API_KEY;

    // GeoJSON 파일의 URL (실제 URL로 대체해야 함)
    const geojsonUrl = './geojson.geojson';

    // GitHub Actions에서는 시크릿을 이용하여 API 키를 가져오기 때문에 노출되지 않음
    const response = await axios.get(geojsonUrl);

    // 클러스터 값이 1인 좌표만 필터링
    const filteredFeatures = response.data.features.filter(feature => feature.properties.cluster === 1);

    // 지도 초기화
    const map = new kakao.maps.Map(document.getElementById('map'), {
      center: new kakao.maps.LatLng(37.5665, 126.9780), // 서울시청 좌표
      level: 10,
    });

    // 슈퍼클러스터 초기화
    const supercluster = new Supercluster({
      radius: 40,
      maxZoom: 16,
    });

    // 데이터를 슈퍼클러스터에 추가
    supercluster.load(filteredFeatures);

    // 클러스터된 마커 생성
    const markers = supercluster.getClusters([-180, -90, 180, 90], map.getLevel());

    // 클러스터된 마커를 지도에 표시
    markers.forEach(marker => {
      const coords = new kakao.maps.LatLng(marker.geometry.coordinates[1], marker.geometry.coordinates[0]);

      const clusterMarker = new kakao.maps.Marker({
        position: coords,
        text: marker.properties.point_count.toString(),
        zIndex: marker.properties.point_count,
      });

      clusterMarker.setMap(map);
    });
  } catch (error) {
    console.error('Error fetching or processing data:', error);
  }
}

// 실행
fetchData();
