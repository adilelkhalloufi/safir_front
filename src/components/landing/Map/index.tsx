import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'

import markerIconPng from '@/assets/storeMapIcon.svg'
import L from 'leaflet'
// list of postion in rabat
const ListPotion = [
  { position: [34.020882, -6.841650], label: "Hassan Tower" },
  { position: [34.022505, -6.834619], label: "Mausoleum of Mohammed V" },
  { position: [34.023283, -6.835505], label: "Oudaias Kasbah" },
  { position: [34.010505, -6.831736], label: "Royal Palace of Rabat" },
  { position: [34.018368, -6.847406], label: "Chellah Necropolis" },
  { position: [34.009286, -6.820349], label: "Agdal" },
  { position: [34.007801, -6.849533], label: "Hay Riad" },
  { position: [34.027739, -6.837738], label: "Rabat Beach" },
  { position: [33.971641, -6.854056], label: "Mohammed VI Museum of Modern Art" },
  { position: [34.013775, -6.832796], label: "National Archaeological Museum" },
  { position: [34.023605, -6.840700], label: "Grand Mosque of Rabat" },
  { position: [34.015661, -6.834340], label: "Rabat Central Market" },
  { position: [34.006708, -6.837111], label: "Moroccan Parliament" },
  { position: [34.015228, -6.837429], label: "Rabat-Ville Railway Station" },
  { position: [34.002616, -6.844702], label: "Mega Mall Rabat" },
  { position: [35.787301, -5.812476], label: "Tangier Ville Railway Station" },
  { position: [35.789607, -5.813137], label: "Grand Socco Square" },
  { position: [35.787647, -5.818634], label: "Petit Socco" },
  { position: [35.785832, -5.818364], label: "Kasbah Museum" },
  { position: [35.790306, -5.808670], label: "Place de France" },
  { position: [35.785479, -5.812698], label: "American Legation Museum" },
  { position: [35.769568, -5.802226], label: "Cap Spartel Lighthouse" },
  { position: [35.758780, -5.934345], label: "Caves of Hercules" },
  { position: [35.767957, -5.841295], label: "Ibn Batouta Airport" },
  { position: [35.774701, -5.822387], label: "Tangier Beach" },
  { position: [35.788879, -5.815570], label: "Mendoubia Gardens" },
  { position: [35.785546, -5.822048], label: "Port of Tangier" },
  { position: [35.793089, -5.812394], label: "Tangier Ibn Battouta Stadium" },
  { position: [35.798947, -5.830025], label: "Tanger City Mall" },
  { position: [35.773119, -5.793679], label: "Royal Golf Club" }


 
]
const position : any = [34.020882, -6.84165]

const customIcon = L.icon({
  iconUrl: markerIconPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
  shadowSize: [41, 41],
})
export default function index() {
  return (
    <>

      <MapContainer
        style={{ height: 300 }}
        center={position}
        zoom={5}
        scrollWheelZoom={true}
      >
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={(cluster : any) => {
            return L.divIcon({
              html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
              className: 'custom-marker-cluster',
              iconSize: L.point(40, 40, true),
            })
          }}
        >
          {ListPotion.map((position:any, idx) => (
            <Marker
              key={`marker-${idx}`}
              position={position.position}
              icon={customIcon}
            >
              <Popup>{position.label}</Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
      </>
  )
}
