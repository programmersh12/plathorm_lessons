export const MOCK_COURSES = [
  {
    _id: '1',
    title: 'Основы JavaScript',
    description: 'Освойте основы JavaScript на практических упражнениях.',
    category: 'Программирование',
    level: 'beginner',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=300&fit=crop',
    price: 0,
    duration: 12,
    instructorId: { firstName: 'Алексей', lastName: 'Петров' },
    rating: { average: 4.7, count: 128 },
    studentsEnrolled: []
  },
  {
    _id: '2',
    title: 'Разработка на React',
    description: 'Создавайте современные веб-приложения на React и изучайте продвинутые возможности.',
    category: 'Программирование',
    level: 'intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&h=300&fit=crop',
    price: 49,
    duration: 20,
    instructorId: { firstName: 'Анна', lastName: 'Смирнова' },
    rating: { average: 4.8, count: 250 },
    studentsEnrolled: []
  },
  {
    _id: '5',
    title: 'Разработка мобильных приложений',
    description: 'Создавайте кроссплатформенные мобильные приложения на React Native.',
    category: 'Программирование',
    level: 'advanced',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=300&fit=crop',
    price: 79,
    duration: 24,
    instructorId: { firstName: 'Дмитрий', lastName: 'Волков' },
    rating: { average: 4.6, count: 93 },
    studentsEnrolled: []
  }
];
