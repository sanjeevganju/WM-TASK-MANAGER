import { trekAPI, taskAPI, staffAPI } from './api';
import { Task } from '../App';

// Trek data with specific dates
export const initialTreks = [
  {
    name: 'Markha Valley Trek',
    startDate: '2025-06-15',
    endDate: '2025-06-22',
    numberOfClients: 12,
    baseName: 'Ladakh'
  },
  {
    name: 'Hampta Pass Trek',
    startDate: '2025-06-22',
    endDate: '2025-06-29',
    numberOfClients: 18,
    baseName: 'Himachal'
  },
  {
    name: 'Nubra Valley Trek',
    startDate: '2025-06-29',
    endDate: '2025-07-06',
    numberOfClients: 8,
    baseName: 'Ladakh'
  },
  {
    name: 'Hidden Meadows Garhwal',
    startDate: '2026-03-15',
    endDate: '2026-03-19',
    numberOfClients: 24,
    baseName: 'Uttarakhand'
  }
];

// Staff database
export const initialStaff = {
  tripLeaders: ['Rajesh Kumar', 'Amit Singh', 'Priya Sharma', 'Deepak Verma', 'Neha Patel'],
  cooks: ['Ramesh Bisht', 'Suresh Negi', 'Kailash Thapa', 'Mohan Rawat', 'Dinesh Kumar'],
  assistantGuides: ['Vijay Singh', 'Sonam Dorje', 'Tashi Namgyal', 'Karma Wangdi', 'Lobsang Dorji', 'Rinchen Dorji'],
  supportStaff: ['Raju Lal', 'Shankar Prasad', 'Bhim Bahadur', 'Jeet Singh', 'Narender Kumar', 'Prakash Rai']
};

// Seed the database with initial data
export async function seedDatabase() {
  console.log('Starting database seeding...');
  
  try {
    // 1. Seed staff database
    console.log('Seeding staff database...');
    await staffAPI.update(initialStaff);
    
    // 2. Seed treks
    console.log('Seeding treks...');
    const createdTreks = [];
    for (const trek of initialTreks) {
      const created = await trekAPI.create(trek);
      createdTreks.push(created);
      console.log(`Created trek: ${created.name}`);
    }
    
    console.log('Database seeded successfully!');
    return { treks: createdTreks, success: true };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, error };
  }
}

// Check if database has been seeded
export async function checkIfSeeded() {
  try {
    const treks = await trekAPI.getAll();
    return treks.length > 0;
  } catch (error) {
    console.error('Error checking if seeded:', error);
    return false;
  }
}
