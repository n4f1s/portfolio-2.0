import AboutMe from './sections/AboutMe';
import Banner from './sections/Banner';
import Experiences from './sections/Experiences';
import { Fragment } from 'react';
import LeetCodeStats from './sections/LeetCodeStats';
import { ClientProjectList, ClientSkills } from './sections/ClientComponents';




export default function Home() {

    return (
        <Fragment>
            <Banner />
            <AboutMe />
            <ClientSkills />
            <Experiences />
            <LeetCodeStats />
            <ClientProjectList />
        </Fragment>
    );
}