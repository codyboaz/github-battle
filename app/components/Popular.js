import React from 'react'
import PropTypes from 'prop-types'
import { fetchPopularRepos } from '../utils/api'
import { FaUser, FaStar, FaCodeBranch, FaExclamation, FaExclamationTriangle } from 'react-icons/fa'
import Card from './Card'
import Loading from './Loading'
import Tooltip from './Tooltip'

function LanguagesNav({ selected, setSelectedLanguage }) {
  const languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python'];
  return (
    <ul className="flex-center">
      {languages.map((language) => (
        <li key={language}>
          <button
            className="btn-clear nav-link"
            style={selected === language ? { color: 'rgb(187, 46, 31)' } : null}
            onClick={() => { setSelectedLanguage(language) }}>
            {language}
          </button>
        </li>
      ))}
    </ul>
  )
}

LanguagesNav.propTypes = {
  selected: PropTypes.string.isRequired,
  setSelectedLanguage: PropTypes.func.isRequired
}

function ReposGrid({ repos }) {
  return (
    <ul className='grid space-around'>
      {repos.map((repo, index) => {
        const { name, owner, html_url, stargazers_count, forks, open_issues } = repo
        const { login, avatar_url } = owner

        return (
          <li key={html_url}>
            <Card
              header={`#${index + 1}`}
              avatar={avatar_url}
              href={html_url}
              name={login}
            >
              <ul className="card-list">
                <li>
                  <Tooltip text='Github username'>
                    <FaUser color='rgb(255, 191, 116)' size={22} />
                    <a href={`https://github.com/${login}`}>
                      {login}
                    </a>
                  </Tooltip>
                </li>
                <li>
                  <FaStar color='rgb(255, 215, 0)' size={22} />
                  {stargazers_count.toLocaleString()} stars
                </li>
                <li>
                  <FaCodeBranch color='rgb(129, 195, 245)' size={22} />
                  {forks.toLocaleString()} forks
                </li>
                <li>
                  <FaExclamationTriangle color='rgb(255, 191, 116)' size={22} />
                  {open_issues.toLocaleString()} open
                </li>
              </ul>
            </Card>
          </li>
        )
      })}
    </ul>
  )
}

export default function Popular() {
  const [selectedLanguage, setSelectedLanguage] = React.useState('All');
  const [repos, setRepos] = React.useState({});
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    setSelectedLanguage(selectedLanguage);
    setError(null)

    if (!repos[selectedLanguage]) {
      fetchPopularRepos(selectedLanguage)
        .then((data) => {
          setRepos({...repos, [selectedLanguage]: data})
        })
        .catch((error) => {
          console.warn('Error fetching repos: ', error)
          setError('There was an error fetching the repositories')
        })
      }
  }, [selectedLanguage])

  const isLoading = () => {
    return !repos[selectedLanguage] && error === null
  }

  return (
    <React.Fragment>
      <LanguagesNav
        selected={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />

      {isLoading() && <Loading text='Fetching Repos' />}

      {error && <p className='center-text error'>{error}</p>}

      {repos[selectedLanguage] && <ReposGrid repos={repos[selectedLanguage]} />}
    </React.Fragment>
  )
  
}