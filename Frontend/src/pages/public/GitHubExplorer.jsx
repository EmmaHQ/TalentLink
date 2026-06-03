import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://talentlink-1-bbse.onrender.com/api";

export default function GithubExplorer({ githubUsername }) {

  const [githubUser, setGithubUser] = useState(null);

  useEffect(() => {

    if (!githubUsername) return;

    const loadGithub = async () => {

      try {

        const { data } = await axios.get(
          `${API}/github/${githubUsername}`
        );

        setGithubUser(data);

      } catch (error) {
        console.error(error);
      }
    };

    loadGithub();

  }, [githubUsername]);

  if (!githubUser) return null;

  return (
    <div className="mt-6 p-6 rounded-2xl bg-white/10 border border-white/20">

      <h2 className="text-xl font-bold mb-4">
        GitHub
      </h2>

      <img
        src={githubUser.avatar_url}
        alt={githubUser.login}
        className="w-24 h-24 rounded-full"
      />

      <h3 className="mt-3 text-lg font-semibold">
        {githubUser.login}
      </h3>

      <p>Seguidores: {githubUser.followers}</p>
      <p>Repositorios: {githubUser.public_repos}</p>

      <a
        href={githubUser.html_url}
        target="_blank"
        rel="noreferrer"
        className="text-yellow-400"
      >
        Ver perfil
      </a>

    </div>
  );
}