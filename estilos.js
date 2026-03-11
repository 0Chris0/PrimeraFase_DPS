import { StyleSheet } from "react-native";

export default StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    marginTop: 0,
    paddingTop: 0
    },

  header: {
    backgroundColor: "#2c3e50",
    padding: 20
  },

  titulo: {
    fontSize: 28,
    color: "white",
    textAlign: "center",
    fontWeight: "bold"
  },

  card: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 10,
    elevation: 4
  },

  libroTitulo: {
    fontSize: 18,
    color: "#888"
  },

  libroNombre: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 5
  },

  autor: {
    fontSize: 16,
    color: "#555",
    marginTop: 5
  },

  botones: {
    gap: 10,
    marginHorizontal: 20
  }
});