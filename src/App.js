import React, { useState, useEffect } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import api from "./services/api";

export default function App() {
  const [repositories, setRespositories] = useState([])

  useEffect(() => {
    api.get('repositories').then(response => {
      setRespositories(response.data)
    })
  }, [])

  async function handleLikeRepository(id) {
    await api.post(`repositories/${id}/like`)
    const repoIndex = repositories.findIndex(repo => repo.id === id)
    const reposUpdated = [...repositories]
    reposUpdated[repoIndex].likes++
    setRespositories(reposUpdated)
  }

  function renderRepository(repository) {
    return (
      <View style={styles.repositoryContainer}>
        <Text style={styles.repository}>{repository.title}</Text>

        {renderTechs(repository.techs)}
        {renderLikes(repository)}

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleLikeRepository(repository.id)}
          testID={`like-button-${repository.id}`}
        >
          <Text style={styles.buttonText}>Curtir</Text>
        </TouchableOpacity>
      </View>
    )
  }

  function renderTechs(techs) {
    if (!techs.length) return
    return (
      <View style={styles.techsContainer}>
        {techs.map(tech => (
          <Text key={tech} style={styles.tech}>
            {tech}
          </Text>
        ))}
      </View>
    )
  }
  function renderLikes(repository) {
    return (
      <View style={styles.likesContainer}>
        <Text
          style={styles.likeText}
          testID={`repository-likes-${repository.id}`}
        >
          {repository.likes} curtidas
        </Text>
      </View>
    )
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={(repository) => repository.id}
          renderItem={({ item: repository }) =>
            renderRepository(repository)
          }
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
