// Leaflet을 사용하여 지도 생성
var map = L.map('map').setView([37.5665, 126.9780], 13);

// 카카오 지도 타일 레이어 추가
L.tileLayer('https://dapi.kakao.com/v2/maps/sdk.js?appkey=' + process.env.KAKAO_MAP_API_KEY, {
    attribution: '© Kakao'
}).addTo(map);

// GeoJSON 데이터 가져오기
fetch('http://localhost:3000/your-geojson-url')
    .then(response => response.json())
    .then(data => {
        var markers = L.markerClusterGroup();

        data.features.forEach(feature => {
            // GeoJSON 데이터에서 클러스터 값 확인 (예시: 'cluster' 속성)
            var clusterValue = feature.properties.cluster;

            // 클러스터가 0이면 마커를 생성하여 클러스터 그룹에 추가
            if (clusterValue === 0) {
                var marker = L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);
                markers.addLayer(marker);
            }
        });

        // 클러스터 그룹을 지도에 추가
        map.addLayer(markers);
    })
    .catch(error => console.error('Error fetching GeoJSON:', error));
