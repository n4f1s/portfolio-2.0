import AboutMe from './sections/AboutMe';
import Banner from './sections/Banner';
import Experiences from './sections/Experiences';
import { Fragment } from 'react';
import LeetCodeStats from './sections/LeetCodeStats';
import Testimonials from './sections/Testimonials';
import { ClientProjectList, ClientSkills } from './sections/ClientComponents';




export default function Home() {

    return (
        <Fragment>
            <Banner />
            <AboutMe />
            <ClientSkills />
            <Experiences />
            <Testimonials />
            <LeetCodeStats />
            <ClientProjectList />
        </Fragment>
    );
}