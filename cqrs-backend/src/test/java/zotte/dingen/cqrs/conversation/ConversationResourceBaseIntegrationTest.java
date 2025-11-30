package zotte.dingen.cqrs.conversation;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static zotte.dingen.cqrs.conversation.ConversationTestBuilder.*;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@AutoConfigureMockMvc
public class ConversationResourceBaseIntegrationTest {

    @Autowired
    private ConversationRepository repo;

    @Autowired
    private MockMvc mockMvc;


    @Before
    public void setUp() {
        repo.deleteAll();
    }

    @Test
    public void get_WhenConversationPresent_ReturnsConversation() throws Exception {
        Conversation savedConvo = repo.save(aDefaultConversation().build());
        String id = savedConvo.getId();


        mockMvc.perform(get("/conversations/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.createdOn").value(CREATED_ON))
                .andExpect(jsonPath("$.ConversationDate").value(CONVERSATION_DATE));
    }

//    @Test
//    public void get_NonExistingConversation_Returns404() throws Exception {
//        repo.save(aDefaultConversation().build());
//        ResponseEntity<Conversation> response = conversationResource.get("someOtherId");
//
//        assertThat(response).hasStatus(Response.Status.NOT_FOUND);
//    }
//
//    @Test
//    public void all_WhenConversationsPresent_ReturnsAllConversations() throws Exception {
//        Conversation snarf = aDefaultConversation().withPunchLine("Snarf snarf").build();
//        Conversation liono = aDefaultConversation().withPunchLine("Thundercats! HOOooooooooo!").build();
//        repo.save(Arrays.asList(snarf,liono));
//
//        List<Conversation> conversations = Stream.of(conversationResource.all().readEntity(Conversation[].class)).collect(Collectors.toList());
//
//        assertThat(conversations).containsOnly(snarf, liono);
//    }
//
//    @Test
//    public void all_ReturnsAllConversations_OldestLastByCreatedOn() throws Exception {
//        Conversation snarf2 = aDefaultConversation().withPunchLine("snarf yo").withCreatedOn(LocalDateTime.of(2016, Month.JUNE, 18, 9, 30, 01)).build();
//        Conversation snarf1 = aDefaultConversation().withPunchLine("Snarf snarf").withCreatedOn(LocalDateTime.of(2016, Month.JUNE, 18, 9, 30, 02)).build();
//        Conversation snarf3 = aDefaultConversation().withPunchLine("Snarf the turd").withCreatedOn(LocalDateTime.of(2016, Month.JUNE, 18, 9, 30, 03)).build();
//        repo.save(Arrays.asList(snarf1, snarf2, snarf3));
//
//        List<Conversation> conversations = Stream.of(conversationResource.all().readEntity(Conversation[].class)).collect(Collectors.toList());
//
//        assertThat(conversations).containsExactly(snarf3, snarf1, snarf2);
//    }
//
//    @Test
//    public void all_WhenNoConversationsPresent_Returns200() throws Exception {
//        Response response = conversationResource.all();
//
//        assertThat(response).hasStatus(Response.Status.OK);
//    }
//
//    @Test
//    public void create_ValidConversation_ReturnsNewLocation() throws Exception {
//        Conversation conversation = aDefaultConversation().withId(null).build();
//        Response response = conversationResource.create(conversation);
//
//        assertThat(response).hasStatus(Response.Status.CREATED);
//        assertThat(response).hasLocationContaining(baseUrl+"/conversation/");
//    }
//
//    @Test
//    public void create_InvalidConversation_ReturnsBadRequest() throws Exception {
//        Line speechLineWithoutParticipant = aSpeechLine().withoutParticipants().withText("derp").build();
//        Conversation conversation = aDefaultConversation().withId(null).withLines(speechLineWithoutParticipant).build();
//        Response response = conversationResource.create(conversation);
//
//        assertThat(response.getHeaderString("Application-Error")).isEqualTo("The conversation you tried to create is invalid");
//        assertThat(response).hasStatus(Response.Status.BAD_REQUEST);
//    }
//
//    @Test
//    public void delete_WhenConversationPresent_DeletesConversation() throws Exception {
//        Conversation savedConvo = repo.save(aDefaultConversation().build());
//        String id = savedConvo.getId();
//        Response response = conversationResource.delete(id);
//
//        assertThat(response).hasStatus(Response.Status.OK);
//
//        Conversation conversation = repo.findOne(id);
//        assertThat(conversation).isNull();
//    }
//
//    @Test
//    public void delete_NonExistingConversation_Returns404() throws Exception {
//        Conversation savedConvo = repo.save(aDefaultConversation().build());
//        String id = savedConvo.getId();
//        Response response = conversationResource.delete("someOtherId");
//
//        assertThat(response).hasStatus(Response.Status.NOT_FOUND);
//
//        Conversation conversation = repo.findOne(id);
//        assertThat(conversation).isEqualTo(savedConvo);
//    }
//
//    @Test
//    public void update_ValidConversation_PersistsUpdatedConversationAndReturnsIt() throws Exception {
//        Conversation snarf = aDefaultConversation().withPunchLine("Snarf snarf").build();
//        Conversation savedSnarf = repo.save(snarf);
//        String savedSnarfId = savedSnarf.getId();
//
//        Conversation updatedInGUISnarf = aDefaultConversation().withId(savedSnarfId).withPunchLine("ThunderCats! HOOooooooo!").build();
//
//        Response response = conversationResource.update(savedSnarfId, updatedInGUISnarf);
//
//        assertThat(response).hasStatus(Response.Status.OK);
//
//        Conversation snarfAfterUpdate = repo.findOne(savedSnarfId);
//        assertThat(snarfAfterUpdate).isEqualTo(updatedInGUISnarf);
//    }
//
//    @Test
//    public void update_NonExistingConversation_Returns404() throws Exception {
//        Conversation snarf = aDefaultConversation().withPunchLine("Snarf snarf").build();
//        Conversation savedSnarf = repo.save(snarf);
//        String savedSnarfId = savedSnarf.getId();
//
//        Conversation updatedInGUISnarf = aDefaultConversation().withId(savedSnarfId).withPunchLine("ThunderCats! HOOooooooo!").build();
//
//        Response response = conversationResource.update("someOtherId", updatedInGUISnarf);
//
//        assertThat(response).hasStatus(Response.Status.NOT_FOUND);
//
//        Conversation snarfAfterUpdate = repo.findOne(savedSnarfId);
//        assertThat(snarfAfterUpdate).isEqualTo(snarf);
//    }
}