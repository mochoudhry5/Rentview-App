export const sampleData: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    rooms: string;
    address: string; 
  }> = Array({
    id: 1,
    name: 'Sample Home 1',
    latitude: 0.001, // Adjust latitude to be close to the user
    longitude: 0.001, // Adjust longitude to be close to the user
    rooms: 'For rent: Entire Home: (2 bd - 2 br)',
    address: '1234 Main St, San Franciso CA 12345'
  },
  {
    id: 2,
    name: 'Sample Home 2',
    latitude: 0.002, // Adjust latitude to be close to the user
    longitude: 0.002, // Adjust longitude to be close to the user
    rooms: 'For rent: Partial Home (1 bd - 1 br)',
    address: '4321 Washington Ave, San Franciso CA 12345'
  },
  {
    id: 3,
    name: 'Sample Home 3',
    latitude: 0.003, // Adjust latitude to be close to the user
    longitude: 0.003, // Adjust longitude to be close to the user
    rooms: 'For rent: Entire Home (3 bd - 3 br)',
    address: '6789 Dorsett Rd, San Franciso CA 12345'
  });