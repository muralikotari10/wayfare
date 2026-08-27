import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const destinations = [
  ['Andhra Pradesh', 'Tirupati', 13.6288, 79.4192], ['Andhra Pradesh', 'Visakhapatnam', 17.6868, 83.2185], ['Andhra Pradesh', 'Araku Valley', 18.3273, 82.8792], ['Andhra Pradesh', 'Gandikota', 14.8136, 78.2856],
  ['Assam', 'Guwahati', 26.1445, 91.7362], ['Assam', 'Kaziranga National Park', 26.5775, 93.1711], ['Assam', 'Majuli', 27.0016, 94.2243], ['Assam', 'Sivasagar', 26.9843, 94.6377],
  ['Bihar', 'Bodh Gaya', 24.6961, 84.9914], ['Bihar', 'Nalanda', 25.1357, 85.4437], ['Bihar', 'Rajgir', 25.0268, 85.4208], ['Bihar', 'Patna', 25.5941, 85.1376],
  ['Chhattisgarh', 'Chitrakote Falls', 19.2061, 81.7027], ['Chhattisgarh', 'Bastar', 19.1071, 81.9535], ['Chhattisgarh', 'Raipur', 21.2514, 81.6296], ['Chhattisgarh', 'Sirpur', 21.5149, 82.1847],
  ['Goa', 'Panaji', 15.4909, 73.8278], ['Goa', 'Baga Beach', 15.5557, 73.7517], ['Goa', 'Dudhsagar Falls', 15.3144, 74.3144], ['Goa', 'Old Goa', 15.5009, 73.9116],
  ['Gujarat', 'Ahmedabad', 23.0225, 72.5714], ['Gujarat', 'Rann of Kutch', 23.7337, 69.8597], ['Gujarat', 'Dwarka', 22.2442, 68.9685], ['Gujarat', 'Gir National Park', 21.1243, 70.8242],
  ['Haryana', 'Kurukshetra', 29.9695, 76.8783], ['Haryana', 'Sultanpur National Park', 28.4611, 76.8922], ['Haryana', 'Pinjore', 30.7964, 76.9182], ['Haryana', 'Gurugram', 28.4595, 77.0266],
  ['Himachal Pradesh', 'Shimla', 31.1048, 77.1734], ['Himachal Pradesh', 'Manali', 32.2396, 77.1887], ['Himachal Pradesh', 'Dharamshala', 32.219, 76.3234], ['Himachal Pradesh', 'Spiti Valley', 32.2463, 78.0349],
  ['Jharkhand', 'Ranchi', 23.3441, 85.3096], ['Jharkhand', 'Deoghar', 24.485, 86.6948], ['Jharkhand', 'Betla National Park', 23.887, 84.1907], ['Jharkhand', 'Netarhat', 23.4748, 84.2675],
  ['Karnataka', 'Bengaluru', 12.9716, 77.5946], ['Karnataka', 'Mysuru', 12.2958, 76.6394], ['Karnataka', 'Hampi', 15.335, 76.46], ['Karnataka', 'Gokarna', 14.5479, 74.3188],
  ['Kerala', 'Munnar', 10.0889, 77.0595], ['Kerala', 'Alappuzha', 9.4981, 76.3388], ['Kerala', 'Kochi', 9.9312, 76.2673], ['Kerala', 'Wayanad', 11.6854, 76.132],
  ['Madhya Pradesh', 'Bhopal', 23.2599, 77.4126], ['Madhya Pradesh', 'Khajuraho', 24.8318, 79.9199], ['Madhya Pradesh', 'Ujjain', 23.1765, 75.7885], ['Madhya Pradesh', 'Pachmarhi', 22.4676, 78.4331],
  ['Maharashtra', 'Mumbai', 19.076, 72.8777], ['Maharashtra', 'Pune', 18.5204, 73.8567], ['Maharashtra', 'Ajanta Caves', 20.5519, 75.7033], ['Maharashtra', 'Mahabaleshwar', 17.9307, 73.6477],
  ['Meghalaya', 'Shillong', 25.5788, 91.8933], ['Meghalaya', 'Cherrapunji', 25.284, 91.7216], ['Meghalaya', 'Dawki', 25.194, 92.024], ['Meghalaya', 'Mawlynnong', 25.202, 91.912],
  ['Odisha', 'Bhubaneswar', 20.2961, 85.8245], ['Odisha', 'Puri', 19.8135, 85.8312], ['Odisha', 'Konark', 19.8876, 86.0945], ['Odisha', 'Chilika Lake', 19.7, 85.32],
  ['Punjab', 'Amritsar', 31.634, 74.8723], ['Punjab', 'Patiala', 30.3398, 76.3869], ['Punjab', 'Anandpur Sahib', 31.2368, 76.5007], ['Punjab', 'Wagah Border', 31.6048, 74.5737],
  ['Rajasthan', 'Jaipur', 26.9124, 75.7873], ['Rajasthan', 'Udaipur', 24.5854, 73.7125], ['Rajasthan', 'Jodhpur', 26.2389, 73.0243], ['Rajasthan', 'Jaisalmer', 26.9157, 70.9083],
  ['Sikkim', 'Gangtok', 27.3389, 88.6065], ['Sikkim', 'Pelling', 27.3, 88.23], ['Sikkim', 'Lachung', 27.6881, 88.7403], ['Sikkim', 'Nathula Pass', 27.3869, 88.8303],
  ['Tamil Nadu', 'Chennai', 13.0827, 80.2707], ['Tamil Nadu', 'Ooty', 11.4064, 76.6932], ['Tamil Nadu', 'Madurai', 9.9252, 78.1198], ['Tamil Nadu', 'Rameswaram', 9.2876, 79.3129],
  ['Telangana', 'Hyderabad', 17.385, 78.4867], ['Telangana', 'Warangal', 17.9821, 79.5971], ['Telangana', 'Ramoji Film City', 17.2543, 78.6808], ['Telangana', 'Ramappa Temple', 18.2593, 79.9436],
  ['Uttar Pradesh', 'Agra', 27.1767, 78.0081], ['Uttar Pradesh', 'Varanasi', 25.3176, 82.9739], ['Uttar Pradesh', 'Lucknow', 26.8467, 80.9462], ['Uttar Pradesh', 'Sarnath', 25.381, 83.0227],
  ['Uttarakhand', 'Rishikesh', 30.0869, 78.2676], ['Uttarakhand', 'Nainital', 29.3919, 79.4542], ['Uttarakhand', 'Mussoorie', 30.4598, 78.0644], ['Uttarakhand', 'Jim Corbett National Park', 29.530, 78.7747],
  ['West Bengal', 'Kolkata', 22.5726, 88.3639], ['West Bengal', 'Darjeeling', 27.041, 88.2663], ['West Bengal', 'Sundarbans', 21.9497, 89.1833], ['West Bengal', 'Shantiniketan', 23.681, 87.685],
  ['Andhra Pradesh', 'Vijayawada', 16.5062, 80.648], ['Gujarat', 'Somnath', 20.888, 70.401], ['Karnataka', 'Coorg', 12.3375, 75.8069], ['Kerala', 'Kovalam', 8.4004, 76.9787],
  ['Maharashtra', 'Ellora Caves', 20.0268, 75.178], ['Rajasthan', 'Pushkar', 26.4899, 74.5511], ['Tamil Nadu', 'Kanyakumari', 8.0883, 77.5385], ['Telangana', 'Thousand Pillar Temple', 17.9784, 79.5941],
];

const childLabels = ['Heritage landmark', 'Scenic viewpoint', 'Local market', 'Nature walk', 'Cultural experience'];
const makeChildren = (name, lat, lng) => childLabels.map((label, index) => ({
  name: `${name} ${label}`,
  coordinates: { lat: Number((lat + (index - 2) * 0.006).toFixed(6)), lng: Number((lng + (index % 2 ? 1 : -1) * 0.006).toFixed(6)) },
  description: `A recommended ${label.toLowerCase()} to include while exploring ${name}. Check current opening hours and local access conditions before visiting.`,
}));

const seed = destinations.map(([state, name, lat, lng], index) => ({
  id: `india-${String(index + 1).padStart(3, '0')}`,
  name,
  state,
  country: 'India',
  coordinates: { lat, lng },
  description: `${name} is a memorable destination in ${state}, known for its local history, landscapes, culture, food, and nearby experiences. Use this guide to discover the area and plan a respectful visit.`,
  childAttractions: makeChildren(name, lat, lng),
}));

if (seed.length !== 100) throw new Error(`Expected 100 destinations, generated ${seed.length}`);
const outputPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'india_places_seed.json');
await fs.writeFile(outputPath, `${JSON.stringify(seed, null, 2)}\n`, 'utf8');
console.log(`Wrote ${seed.length} destinations to ${outputPath}`);
