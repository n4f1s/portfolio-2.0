import AboutMe from './sections/AboutMe';
import Banner from './sections/Banner';
import Experiences from './sections/Experiences';
import Skills from './sections/Skills';
import ProjectList from './sections/ProjectList';
import { Fragment } from 'react';

export default function Home() {
    return (
        <Fragment>
            <Banner />
            <AboutMe />
            <Skills />
            <Experiences />
            <ProjectList />
        </Fragment>
    );
}