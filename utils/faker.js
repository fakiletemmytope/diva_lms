import { UserModel, Status, UserType } from "../schema/user.js"
import { LessonModel, LessonType } from "../schema/lesson.js";
import { fa, faker } from '@faker-js/faker';
import { hash_password } from "./passwd.js";

function getRandomEnum(enumObject) {
    const enum_type = Object.values(enumObject);
    const randomIndex = Math.floor(Math.random() * enum_type.length);
    return enum_type[randomIndex]
}

const generate_a_random_user = async (usertype = null) => {
    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        userType: usertype || getRandomEnum(UserType),
        password: "*.Oluwaseyi88.*"
    }
    return user
}



const generateMultipleUsers = async (count, usertype) => {
    const users = await Promise.all(
        Array.from({ length: count }, async () => await generate_a_random_user(usertype))
    );
    return users;
};


const generate_a_random_course = async () => {
    const course = {
        title: faker.lorem.sentence({ min: 5, max: 8 }),
        description: faker.lorem.sentence({ min: 5, max: 12 }),
        duration: `${faker.number.int(100)}min`,
        price: `$${faker.number.int(100)}`,
    }
    //console.log(course)
    return course
}

const generateMultipleCourses = async (count) => {
    const courses = await Promise.all(
        Array.from({ length: count }, async () => await generate_a_random_course())
    );
    // console.log(courses)
    return courses;
};


const generate_a_random_lesson = async (instructor_id, course_id) => {
    const lesson = {
        topic: faker.lorem.sentence({ min: 5, max: 8 }),
        objectives: [
            faker.lorem.sentence({ min: 5, max: 8 }),
            faker.lorem.sentence({ min: 5, max: 8 }),
            faker.lorem.sentence({ min: 5, max: 8 })
        ],
        lessonType: getRandomEnum(LessonType),
        resources: [
            {
                title: faker.lorem.sentence({ min: 5, max: 8 }),
                url: faker.internet.url()
            },
            {
                title: faker.lorem.sentence({ min: 5, max: 8 }),
                url: faker.internet.url()
            },
        ],
        course_id: course_id,
        instructor_id: instructor_id

    }
    return lesson
}


const generateMultipleLessons = async (count, instructor_id, course_id) => {
    const lessons = await Promise.all(
        Array.from({ length: count }, async () => await generate_a_random_lesson(instructor_id, course_id))
    );
    return lessons;
};

export {
    generate_a_random_course,
    generate_a_random_user,
    generate_a_random_lesson,
    generateMultipleUsers,
    generateMultipleCourses,
    generateMultipleLessons,
}

// console.log(await generateMultipleUsers(5))
// console.log(await generate_a_random_user())
// console.log(await generate_a_random_course("hgefguygfureu"))
// console.log(await generate_a_random_lesson("noieruhihgf", "eyjgeuwagueg"))