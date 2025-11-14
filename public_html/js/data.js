/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
const users = [
  { id: 1, name: "Ana Silva" },
  { id: 2, name: "João Costa" },
  { id: 3, name: "Rita Fernandes" },
  { id: 4, name: "Miguel Santos" },
  { id: 5, name: "Carla Oliveira" }
];

const collections = [
  { id: 1, name: "Star Wars Miniatures", userId: 1 },
  { id: 2, name: "Comic Books", userId: 2 },
  { id: 3, name: "Coins", userId: 3 },
  { id: 4, name: "Stamps", userId: 4 },
  { id: 5, name: "Locomotive Miniatures", userId: 5 }
];


// Eventos globais, acessíveis em várias páginas
const events = [
  {
    id: 1,
    name: 'Star Wars Day',
    date: '2025-05-04T18:00',
    description: 'Meetup de colecionadores Star Wars.',
    images: [
      'collection1.jpg','collection2.jpg','collection3.jpg','collection4.jpg','collection5.jpg',
      'starwars-banner.jpg','falcon.jpg','stormtrooper.jpg'
    ],
    collections: [
      {
        name: 'Collection1',
        img: 'collection1.jpg',
        items: [
          { name: 'Millennium Falcon 1979', img: 'falcon.jpg' },
          { name: 'Stormtrooper Mk I',      img: 'stormtrooper.jpg' },
          { name: 'Banner 1997',            img: 'starwars-banner.jpg' }
        ]
      },
      {
        name: 'Collection2',
        img: 'collection2.jpg',
        items: [
          { name: 'Poster X', img: 'collection2.jpg' },
          { name: 'Poster Y', img: 'collection3.jpg' }
        ]
      },
      {
        name: 'Collection3',
        img: 'collection3.jpg',
        items: [
          { name: 'Selos raros A', img: 'collection3.jpg' },
          { name: 'Selos raros B', img: 'collection4.jpg' }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Coin Fair Lisboa',
    date: '2025-11-25T10:00',
    description: 'Rare coins and banknotes fair.',
    images: ['coin1.jpg','coin2.jpg','coin3.jpg','coin4.jpg','coin5.jpg'],
    collections: [] // podes depois preencher se quiseres
  },
  {
    id: 3,
    name: 'Retro Expo Porto',
    date: '2025-12-02T15:00',
    description: 'Retro exhibition with miniatures and comics.',
    images: ['stamp1.jpg','stamp2.jpg','stamp3.jpg','stamp4.jpg','train1.jpg','collection2.jpg'],
    collections: []
  }
];
