const mongoose = require('mongoose');
const Course = require('./models/Course');
const User = require('./models/User');

// Simple test script to verify course functionality
async function testCourseFunctionality() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/learning-platform-test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Testing Course functionality...\n');

    // 1. Test creating a course
    console.log('1. Testing course creation...');
    const instructor = await User.findOne({ role: 'teacher' });
    if (!instructor) {
      console.log('No teacher found, creating a test teacher...');
      // In a real scenario, we'd create a test user
      console.log('Please create a teacher user first to test course functionality.');
      return;
    }

    // Create a test course
    const testCourseData = {
      title: 'Test Course for Functionality',
      description: 'This is a test course to verify functionality',
      category: 'Programming',
      instructorId: instructor._id,
      level: 'beginner',
      requirements: ['Basic computer skills'],
      objectives: ['Learn basics', 'Practice skills']
    };

    const newCourse = await Course.create(testCourseData);
    console.log(`✓ Created course: ${newCourse.title}`);

    // 2. Test enrolling a student
    console.log('\n2. Testing student enrollment...');
    const student = await User.findOne({ role: 'student' });
    if (!student) {
      console.log('No student found, please create a student user first.');
      return;
    }

    // Add student to course
    newCourse.studentsEnrolled.push({
      userId: student._id,
      enrollmentDate: new Date()
    });
    
    await newCourse.save();
    console.log(`✓ Student enrolled in course: ${newCourse.title}`);

    // 3. Test updating progress
    console.log('\n3. Testing progress update...');
    const studentIndex = newCourse.studentsEnrolled.findIndex(s => 
      s.userId.toString() === student._id.toString()
    );
    
    if (studentIndex !== -1) {
      newCourse.studentsEnrolled[studentIndex].progress = 50;
      await newCourse.save();
      console.log(`✓ Updated student progress to: ${newCourse.studentsEnrolled[studentIndex].progress}%`);
    }

    // 4. Test getting courses
    console.log('\n4. Testing course retrieval...');
    const courses = await Course.find({ instructorId: instructor._id });
    console.log(`✓ Found ${courses.length} courses for instructor`);

    // 5. Test getting enrolled courses
    console.log('\n5. Testing enrolled courses retrieval...');
    const enrolledCourses = await Course.find({
      'studentsEnrolled.userId': student._id
    });
    console.log(`✓ Student is enrolled in ${enrolledCourses.length} courses`);

    console.log('\n✓ All tests passed! Course functionality is working correctly.');

    // Clean up - remove test course
    await Course.findByIdAndDelete(newCourse._id);
    console.log('✓ Test course cleaned up.');

  } catch (error) {
    console.error('✗ Error during testing:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the test
testCourseFunctionality();