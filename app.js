(function () {
  'use strict';

  class OnlineCourse {
    constructor(courseId, title, description, duration, lecturer, category, promote, courseImage) {
      this.courseId = Number(courseId);
      this.title = title;
      this.description = description;
      this.duration = Number(duration);
      this.lecturer = lecturer;
      this.category = category;
      this.promote = Boolean(promote);
      this.courseImage = courseImage;
    }
  }

  const mockCourses = [
    new OnlineCourse(1, 'Microsoft 365', 'Using software within the Microsoft 365 suite.', 30, 'Thida Mankongprasit', 'Basic', false, 'public/course1.png'),
    new OnlineCourse(2, 'Google Workspace', 'Utilizing the Google Workspace software suite.', 30, 'Bowornthat Nanthaphot', 'Basic', true, 'public/course2.png'),
    new OnlineCourse(3, 'Infographic by Canva', 'Using the Canva program to create infographics.', 20, 'Eknat Chongchanya', 'Graphics', true, 'public/course3.png'),
    new OnlineCourse(4, 'Java', 'Fundamental programming with Java.', 30, 'Naphatsorn Ratsameechot', 'Coding', false, 'public/course4.png'),
    new OnlineCourse(5, 'Basic Data Analysis', 'Basic data analysis using Looker Studio.', 20, 'Natthapol Pathumdecha', 'Other', true, 'public/course5.png')
  ];

  angular
    .module('courseApp', ['ngRoute'])
    .config(routeConfig)
    .controller('CourseController', CourseController);

  routeConfig.$inject = ['$routeProvider'];
  function routeConfig($routeProvider) {
    $routeProvider
      .when('/', { templateUrl: 'home.html' })
      .when('/courses', { templateUrl: 'courses.html' })
      .when('/manage', { templateUrl: 'manage.html' })
      .otherwise({ redirectTo: '/' });
  }

  CourseController.$inject = ['$timeout'];
  function CourseController($timeout) {
    const vm = this;

    vm.courses = mockCourses.slice();
    vm.categories = ['Basic', 'Graphics', 'Coding', 'Other'];
    vm.images = [1, 2, 3, 4, 5].map(function (number) {
      return { label: 'Course image ' + number, path: 'public/course' + number + '.png' };
    });
    vm.form = emptyCourse();
    vm.formVisible = false;
    vm.message = '';
    vm.applicationMessage = '';

    vm.promotedCourses = function () {
      return vm.courses.filter(function (course) { return course.promote; });
    };

    vm.applyCourse = function (course) {
      vm.applicationMessage = 'You have selected "' + course.title + '" for application.';
    };

    vm.isEditing = function () {
      return vm.form.courseId !== null;
    };

    vm.openAddForm = function () {
      vm.form = emptyCourse();
      vm.formVisible = true;
      vm.message = '';
      focusForm();
    };

    vm.editCourse = function (course) {
      vm.form = angular.copy(course);
      vm.formVisible = true;
      vm.message = '';
      focusForm();
    };

    vm.saveCourse = function (form) {
      if (form.$invalid) return;

      if (vm.isEditing()) {
        const index = vm.courses.findIndex(function (course) { return course.courseId === vm.form.courseId; });
        vm.courses[index] = new OnlineCourse(
          vm.form.courseId,
          vm.form.title,
          vm.form.description,
          vm.form.duration,
          vm.form.lecturer,
          vm.form.category,
          vm.form.promote,
          vm.form.courseImage
        );
        vm.message = 'Course updated successfully.';
      } else {
        vm.courses.push(new OnlineCourse(
          nextCourseId(),
          vm.form.title,
          vm.form.description,
          vm.form.duration,
          vm.form.lecturer,
          vm.form.category,
          vm.form.promote,
          vm.form.courseImage
        ));
        vm.message = 'Course added successfully.';
      }

      vm.form = emptyCourse();
      vm.formVisible = false;
      form.$setPristine();
      form.$setUntouched();
    };

    vm.deleteCourse = function (courseId) {
      const course = vm.courses.find(function (item) { return item.courseId === courseId; });
      if (!course || !window.confirm('Delete "' + course.title + '"?')) return;

      vm.courses = vm.courses.filter(function (item) { return item.courseId !== courseId; });
      if (vm.form.courseId === courseId) {
        vm.form = emptyCourse();
        vm.formVisible = false;
      }
      vm.message = 'Course deleted successfully.';
    };

    vm.closeForm = function (form) {
      vm.form = emptyCourse();
      vm.formVisible = false;
      if (form) {
        form.$setPristine();
        form.$setUntouched();
      }
    };

    function nextCourseId() {
      return vm.courses.length ? Math.max.apply(null, vm.courses.map(function (course) { return course.courseId; })) + 1 : 1;
    }

    function focusForm() {
      $timeout(function () {
        const formElement = document.getElementById('course-form');
        if (formElement) formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    function emptyCourse() {
      return {
        courseId: null,
        title: '',
        description: '',
        duration: null,
        lecturer: '',
        category: '',
        promote: false,
        courseImage: ''
      };
    }
  }
})();
