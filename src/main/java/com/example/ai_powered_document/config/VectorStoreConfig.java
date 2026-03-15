package com.example.ai_powered_document.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.googleai.GoogleAiEmbeddingModel;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import dev.langchain4j.model.ollama.OllamaChatModel;
import dev.langchain4j.model.ollama.OllamaEmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.inmemory.InMemoryEmbeddingStore;

@Configuration
public class VectorStoreConfig {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @Value("${gemini.chat.model:gemini-2.0-flash}")
    private String geminiChatModel;

    @Value("${gemini.embedding.model:text-embedding-004}")
    private String geminiEmbeddingModel;

    @Value("${ollama.base-url:http://localhost:11434}")
    private String ollamaBaseUrl;

    @Value("${ollama.chat.model:llama3.2}")
    private String ollamaChatModel;

    @Value("${ollama.embedding.model:nomic-embed-text}")
    private String ollamaEmbeddingModel;

    @Bean
    public EmbeddingStore<TextSegment> embeddingStore() {
        return new InMemoryEmbeddingStore<>();
    }

    // @Bean
    // @ConditionalOnProperty(name = "ai.provider", havingValue = "gemini")
    // public EmbeddingModel geminiEmbeddingModel() {
    //     return GoogleAiEmbeddingModel.builder()
    //             .apiKey(geminiApiKey)
    //             .modelName(geminiEmbeddingModel)
    //             .build();
    // }

    // @Bean
    // @ConditionalOnProperty(name = "ai.provider", havingValue = "gemini")
    // public ChatLanguageModel geminiChatModel() {
    //     return GoogleAiGeminiChatModel.builder()
    //             .apiKey(geminiApiKey)
    //             .modelName(geminiChatModel)
    //             .build();
    // }

    @Bean
    @ConditionalOnProperty(name = "ai.provider", havingValue = "ollama", matchIfMissing = true)
    public EmbeddingModel ollamaEmbeddingModel() {
        return OllamaEmbeddingModel.builder()
                .baseUrl(ollamaBaseUrl)
                .modelName(ollamaEmbeddingModel)
                .build();
    }

    @Bean
    @ConditionalOnProperty(name = "ai.provider", havingValue = "ollama", matchIfMissing = true)
    public ChatLanguageModel ollamaChatModel() {
        return OllamaChatModel.builder()
                .baseUrl(ollamaBaseUrl)
                .modelName(ollamaChatModel)
                .build();
    }
}
