import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import SEO from '../components/SEO';

const TimelineContainer = styled.div`
  margin: var(--spacing-2xl) 0;
  font-family: 'Roboto Mono', monospace;
`;

const TimelineTitle = styled.h2`
  color: var(--yellow);
  font-size: var(--font-size-h2);
  margin-bottom: var(--spacing-lg);
  
  &::before {
    content: '$ git log --author="Jason" --oneline';
    display: block;
    color: var(--grey);
    font-size: var(--font-size-small);
    margin-bottom: var(--spacing-sm);
  }
`;

const TimelineItem = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: var(--dark);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--yellow);
  transition: all var(--transition-normal) var(--easing-standard);
  
  &:hover {
    background-color: rgba(255, 221, 26, 0.05);
    transform: translateX(5px);
  }
  
  @media screen and (max-width: 760px) {
    flex-direction: column;
    gap: var(--spacing-xs);
  }
`;

const CommitHash = styled.span`
  color: var(--yellow);
  font-weight: bold;
  min-width: 70px;
  flex-shrink: 0;
  
  @media screen and (max-width: 760px) {
    min-width: auto;
  }
`;

const CommitYear = styled.span`
  color: var(--grey);
  min-width: 50px;
  flex-shrink: 0;
  
  @media screen and (max-width: 760px) {
    min-width: auto;
  }
`;

const CommitMessage = styled.span`
  color: var(--white);
  flex: 1;
`;

const VisualTimeline = styled.div`
  position: relative;
  margin: var(--spacing-2xl) 0;
  padding-left: 40px;
  
  /* Vertical timeline line */
  &::before {
    content: '';
    position: absolute;
    left: 20px;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--yellow);
    opacity: 0.3;
  }
  
  @media (max-width: 760px) {
    padding-left: 30px;
    
    &::before {
      left: 10px;
    }
  }
`;

const VisualTimelineTitle = styled.h2`
  color: var(--grey);
  font-size: var(--font-size-p);
  margin-bottom: var(--spacing-xl);
  font-family: 'Roboto Mono', monospace;
  padding-left: 0;
  margin-left: -40px;
  
  span {
    color: var(--yellow);
  }
  
  @media (max-width: 760px) {
    margin-left: -30px;
  }
`;

const TimelineEvent = styled.div`
  position: relative;
  margin-bottom: var(--spacing-xl);
  padding-left: var(--spacing-lg);
  
  /* Timeline dot */
  &::before {
    content: '';
    position: absolute;
    left: -22px;
    top: 5px;
    width: 14px;
    height: 14px;
    background: var(--yellow);
    border-radius: 50%;
    border: 3px solid var(--blue);
    box-shadow: 0 0 0 4px var(--dark);
    transition: all var(--transition-normal);
    z-index: 1;
  }
  
  &:hover::before {
    transform: scale(1.3);
    box-shadow: 0 0 0 4px var(--dark), 0 0 20px rgba(255, 221, 26, 0.5);
  }
  
  @media (max-width: 760px) {
    padding-left: var(--spacing-md);
    
    &::before {
      left: -17px;
      width: 12px;
      height: 12px;
    }
  }
`;

const CommitHashLabel = styled.div`
  font-family: 'Roboto Mono', monospace;
  color: var(--yellow);
  font-size: var(--font-size-tiny);
  opacity: 0.6;
  margin-bottom: var(--spacing-xs);
`;

const EventYear = styled.div`
  font-family: 'Roboto Mono', monospace;
  color: var(--yellow);
  font-size: var(--font-size-h3);
  font-weight: bold;
  margin-bottom: var(--spacing-xs);
`;

const EventTitle = styled.h3`
  font-family: 'Roboto Mono', monospace;
  color: var(--grey);
  font-size: var(--font-size-h3);
  margin-bottom: var(--spacing-xs);
  margin-top: 0;
`;

const EventDescription = styled.p`
  font-family: 'Roboto Mono', monospace;
  color: var(--grey);
  opacity: 0.7;
  font-size: var(--font-size-small);
  line-height: 1.6;
  margin: 0;
`;

const AboutHeader = styled.div`
  margin-bottom: var(--spacing-xl);
`;

export default function AboutPage() {
  const timeline = [
    { year: '1989', hash: 'a3f2b1c', message: 'Born and raised in North Dakota' },
    { year: '2003', hash: '7d2e9a1', message: 'Started computer repair business - advertised on pizza boxes at dad\'s restaurant' },
    { year: '2007', hash: '5f8c3d2', message: 'Worked at computer repair shop - on-site support, malware removal, networking' },
    { year: '2010', hash: '2b1a4f3', message: 'Supported Microsoft BPOS and Office 365 beta through GA' },
    { year: '2014', hash: '9e4c6d8', message: 'Microsoft FTE - SharePoint OnPrem and SharePoint Online support' },
    { year: '2015', hash: 'f1a7b2e', message: 'Started family, became a parent' },
    { year: 'Present', hash: 'HEAD', message: 'Raising kids, working at Microsoft, running family business, tinkering with Linux' },
  ];

  const visualTimeline = [
    { 
      year: '1989',
      hash: 'a3f2b1c',
      title: 'The Beginning', 
      description: 'Born and raised in North Dakota, where I first discovered my passion for technology and computers.'
    },
    { 
      year: '2003',
      hash: '7d2e9a1',
      title: 'First Business Venture', 
      description: 'Started a computer repair business in high school. Marketed by putting flyers on pizza boxes at my dad\'s pizza restaurant - grassroots marketing at its finest.'
    },
    { 
      year: '2007',
      hash: '5f8c3d2',
      title: 'Computer Repair Technician', 
      description: 'Worked at a computer repair shop repairing computers, providing on-site support to businesses in town, malware removal, data recovery, new PC builds, networking, firewalls, and building websites.'
    },
    { 
      year: '2010',
      hash: '2b1a4f3',
      title: 'Microsoft BPOS & Office 365', 
      description: 'Provided support for Microsoft Business Productivity Online Services (BPOS-S) and BPOS-D, which was the dedicated version of BPOS-S for customers using SharePoint. Supported Office 365 when it was in beta and through general availability (GA).'
    },
    { 
      year: '2014',
      hash: '9e4c6d8',
      title: 'Microsoft Full-Time Employee', 
      description: 'Became a Microsoft full-time employee supporting SharePoint on-premises and SharePoint Online.'
    },
    { 
      year: '2015',
      hash: 'f1a7b2e',
      title: 'Family Life', 
      description: 'Started a family. Learned that debugging code is easier than figuring out why a toddler is crying.'
    },
    { 
      year: '2026',
      hash: 'HEAD',
      title: 'Present Day', 
      description: 'Raising my children, working at Microsoft, running a family small business, enjoying technology and configuring Linux.'
    }
  ];

  return (
    <>
      <SEO title="About" />
      <div className="item1">
        <h1>About</h1>
        
        <AboutHeader>
          <h2>Howdy, my name is Jason 😊</h2>
          <p>
            I'm from the United States, where I live with my family. I've always had a passion for technology—especially Linux-based operating systems, coding, web servers, and everything in between. Some of my favorite tools include VS Code, NeoVim, and Git. I also enjoy creating occasional tech videos for my{' '}
            <a href="https://www.youtube.com/channel/UCP6Y5xvu8VSyXjFHwGMgc6g">
              YouTube channel
            </a>
            .
          </p>
          <p>
            Outside of technology, I'm drawn to topics like discipline, military history, productivity, genealogy, finance, and health and fitness. I also enjoy DIY projects, whether it's building a custom desk or constructing a backyard pergola. I'm a proud Christian and enjoy attending church.
          </p>
          <p>
            My interest in tech started early. As a teenager, I ran my own computer repair business, making house calls and fixing systems for local businesses. One of my first marketing strategies was placing ads on pizza boxes at a local restaurant. A few years later, I moved into web development—designing sites and hosting them on my own servers.
          </p>
          <p>
            Today, I work for a large software company, helping people and customers accomplish their goals. Outside of work, I stay busy with family life and supporting my kid's sports activities.
          </p>
          <p>
            If you're curious about the hardware and software I use, you can check out my <Link to="/uses">uses</Link> page.
          </p>
          <p>Thanks for visiting! 🍻</p>
        </AboutHeader>

        <VisualTimeline>
          <VisualTimelineTitle>
            <span>$</span> git log --author="Jason" --reverse
          </VisualTimelineTitle>
          {visualTimeline.map((event, index) => (
            <TimelineEvent key={index}>
              <CommitHashLabel>commit {event.hash}</CommitHashLabel>
              <EventYear>{event.year}</EventYear>
              <EventTitle>{event.title}</EventTitle>
              <EventDescription>{event.description}</EventDescription>
            </TimelineEvent>
          ))}
        </VisualTimeline>
      </div>
    </>
  );
}
